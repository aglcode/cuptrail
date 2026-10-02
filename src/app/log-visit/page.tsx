import type { Metadata } from 'next';
import { VisitForm } from '@/components/shops/visit-form';
import { getShop, shops } from '@/lib/coffee-data';
export const metadata: Metadata = { title: 'Log a visit' };
export default async function LogVisitPage({ searchParams }: { searchParams: Promise<{ shop?: string }> }) {
  const { shop } = await searchParams;
  return <VisitForm shop={getShop(shop ?? '') ?? shops[0]}/>;
}
