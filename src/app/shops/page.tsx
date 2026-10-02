import { Discover } from '@/components/shops/discover';
import { parseShopFilters } from '@/server/shops/filters';
import { listNeighborhoods, listShops } from '@/server/shops/queries';

export default async function ShopsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseShopFilters(await searchParams);
  const [page, neighborhoods] = await Promise.all([listShops(filters), listNeighborhoods()]);
  return <Discover filters={filters} page={page} neighborhoods={neighborhoods}/>;
}
