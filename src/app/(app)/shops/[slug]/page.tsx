import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopDetail } from "@/components/shops/shop-detail";
import { getShopBySlug } from "@/server/shops/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shop = await getShopBySlug((await params).slug);
  return {
    title: shop?.name ?? "Shop not found",
    description: shop?.description,
  };
}

export default async function ShopPage({ params }: Props) {
  const shop = await getShopBySlug((await params).slug);
  if (!shop) notFound();
  return <ShopDetail shop={shop} />;
}
