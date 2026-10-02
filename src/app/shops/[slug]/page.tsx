import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShopDetail } from '@/components/shops/shop-detail';
import { getShop, shops } from '@/lib/coffee-data';

export function generateStaticParams() { return shops.map(shop => ({ slug: shop.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const shop = getShop(slug);
  return { title: shop?.name ?? 'Shop not found', description: shop?.description };
}
export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shop = getShop(slug);
  if (!shop) notFound();
  return <ShopDetail shop={shop}/>;
}
