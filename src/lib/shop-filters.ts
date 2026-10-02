// Discover filters <-> URL search params. Client-safe (no zod): the server parses
// untrusted params with src/server/shops/filters.ts; this side only serializes.
import type { ShopFilters, ShopSort } from "@/types";

export const SHOP_PAGE_SIZE = 24;
export const DEFAULT_SHOP_SORT: ShopSort = "recommended";
export const shopSorts = [
  "recommended",
  "rating",
  "nearest",
  "name",
] as const satisfies readonly ShopSort[];

export const emptyShopFilters: ShopFilters = {
  amenities: [],
  sort: DEFAULT_SHOP_SORT,
};

/** Serializes filters, omitting defaults so URLs stay short and cacheable. */
export function shopFiltersToSearchParams(
  filters: ShopFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
  if (filters.amenities.length)
    params.set("amenities", [...filters.amenities].sort().join(","));
  if (filters.minRating !== undefined)
    params.set("minRating", String(filters.minRating));
  if (filters.price !== undefined) params.set("price", String(filters.price));
  if (filters.sort !== DEFAULT_SHOP_SORT) params.set("sort", filters.sort);
  return params;
}
