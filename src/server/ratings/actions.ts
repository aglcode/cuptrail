"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, invalid, ok, SIGNED_OUT, type ActionResult } from "@/server/action-result";
import { rateShopSchema, shopIdSchema, type RateShopInput } from "./schemas";

type ShopRating = { ratingAvg: number; ratingCount: number };
type LockedShop = { slug: string; ratingSum: number; ratingCount: number };

/**
 * Locks the shop row for the rest of the transaction. Concurrent ratings of the
 * same shop queue here, so the read-modify-write of the denormalized aggregate
 * can't lose updates. Contention is per shop, never global.
 */
async function lockShop(tx: Prisma.TransactionClient, shopId: string): Promise<LockedShop | undefined> {
  const [shop] = await tx.$queryRaw<LockedShop[]>`
    SELECT "slug", "ratingSum", "ratingCount" FROM "Shop" WHERE "id" = ${shopId} FOR UPDATE`;
  return shop;
}

async function writeAggregate(tx: Prisma.TransactionClient, shopId: string, ratingSum: number, ratingCount: number): Promise<ShopRating> {
  const ratingAvg = ratingCount ? ratingSum / ratingCount : 0;
  await tx.shop.update({ where: { id: shopId }, data: { ratingSum, ratingCount, ratingAvg } });
  return { ratingAvg, ratingCount };
}

function revalidateShop(slug: string) {
  revalidatePath("/shops");
  revalidatePath(`/shops/${slug}`);
}

/** Creates or replaces the signed-in user's rating of a shop. */
export async function rateShop(input: RateShopInput): Promise<ActionResult<ShopRating>> {
  const parsed = rateShopSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const user = await getUser();
  if (!user) return fail(SIGNED_OUT);

  const { shopId, stars, comment, visibility } = parsed.data;
  const result = await prisma.$transaction(async tx => {
    const shop = await lockShop(tx, shopId);
    if (!shop) return null;

    const where = { userId_shopId: { userId: user.id, shopId } };
    const previous = await tx.rating.findUnique({ where, select: { stars: true } });
    await tx.rating.upsert({
      where,
      create: { userId: user.id, shopId, stars, comment, visibility },
      update: { stars, comment, visibility },
    });

    const aggregate = await writeAggregate(
      tx, shopId,
      shop.ratingSum - (previous?.stars ?? 0) + stars,
      shop.ratingCount + (previous ? 0 : 1),
    );
    return { slug: shop.slug, aggregate };
  });

  if (!result) return fail("That shop is no longer in the directory.");
  revalidateShop(result.slug);
  return ok(result.aggregate);
}

/** Removes the signed-in user's rating of a shop, if they have one. */
export async function removeRating(shopId: string): Promise<ActionResult<ShopRating>> {
  const parsed = shopIdSchema.safeParse(shopId);
  if (!parsed.success) return invalid(parsed.error);

  const user = await getUser();
  if (!user) return fail(SIGNED_OUT);

  const result = await prisma.$transaction(async tx => {
    const shop = await lockShop(tx, parsed.data);
    if (!shop) return null;

    const where = { userId_shopId: { userId: user.id, shopId: parsed.data } };
    const previous = await tx.rating.findUnique({ where, select: { stars: true } });
    if (!previous) return { slug: shop.slug, aggregate: null };

    await tx.rating.delete({ where });
    const aggregate = await writeAggregate(tx, parsed.data, shop.ratingSum - previous.stars, shop.ratingCount - 1);
    return { slug: shop.slug, aggregate };
  });

  if (!result) return fail("That shop is no longer in the directory.");
  if (!result.aggregate) return fail("You haven't rated this shop.");
  revalidateShop(result.slug);
  return ok(result.aggregate);
}
