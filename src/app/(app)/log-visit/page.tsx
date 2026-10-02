import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VisitForm } from "@/components/shops/visit-form";
import { isShopSlug } from "@/lib/slug";
import { getShopBySlug, listShopOptions } from "@/server/shops/queries";
import type { ShopOption } from "@/types";

export const metadata: Metadata = { title: "Log a visit" };

export default async function LogVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string | string[] }>;
}) {
  const { shop: requested } = await searchParams;
  const slug =
    typeof requested === "string" && isShopSlug(requested) ? requested : null;
  const [options, requestedShop] = await Promise.all([
    listShopOptions(),
    slug ? getShopBySlug(slug) : null,
  ]);

  const shop: ShopOption | undefined = requestedShop
    ? {
        slug: requestedShop.slug,
        name: requestedShop.name,
        neighborhood: requestedShop.neighborhood,
      }
    : options[0];
  if (!shop) notFound();

  // The picker list is capped; make sure the shop being logged is always in it.
  const pickerOptions = options.some((option) => option.slug === shop.slug)
    ? options
    : [shop, ...options];
  return <VisitForm shop={shop} options={pickerOptions} />;
}
