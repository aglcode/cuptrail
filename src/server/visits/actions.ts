"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  fail,
  invalid,
  ok,
  SIGNED_OUT,
  type ActionResult,
} from "@/server/action-result";
import { logVisitSchema, visitIdSchema, type LogVisitInput } from "./schemas";

export async function logVisit(
  input: LogVisitInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = logVisitSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const user = await getUser();
  if (!user) return fail(SIGNED_OUT);

  try {
    const visit = await prisma.visit.create({
      data: { userId: user.id, ...parsed.data },
      select: { id: true },
    });
    revalidatePath("/me");
    return ok(visit);
  } catch (error) {
    // Foreign key violation: the shop doesn't exist (or was just removed).
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return fail("That shop is no longer in the directory.");
    }
    throw error;
  }
}

export async function deleteVisit(visitId: string): Promise<ActionResult> {
  const parsed = visitIdSchema.safeParse(visitId);
  if (!parsed.success) return invalid(parsed.error);

  const user = await getUser();
  if (!user) return fail(SIGNED_OUT);

  // Scoping the delete by userId is the authorization check: other users' visits match nothing.
  const { count } = await prisma.visit.deleteMany({
    where: { id: parsed.data, userId: user.id },
  });
  if (count === 0) return fail("That visit was already removed.");

  revalidatePath("/me");
  return ok(undefined);
}
