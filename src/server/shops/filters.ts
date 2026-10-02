import "server-only";
import { z } from "zod";
import { isAmenity } from "@/lib/amenities";
import { DEFAULT_SHOP_SORT, shopSorts } from "@/lib/shop-filters";
import { isShopSlug } from "@/lib/slug";
import type { Amenity, ShopFilters } from "@/types";

type RawParams = Record<string, string | string[] | undefined> | URLSearchParams;

// Lenient by design: these come from shareable URLs, so a bad value is dropped
// rather than failing the whole page.
const shopFiltersSchema = z.object({
  q: z.string().trim().min(1).max(100).optional().catch(undefined),
  neighborhood: z.string().trim().min(1).max(100).optional().catch(undefined),
  amenities: z.string().optional()
    .transform(value => [...new Set((value ?? "").split(","))].filter(isAmenity) as Amenity[])
    .catch([]),
  minRating: z.coerce.number().min(0).max(5).optional().catch(undefined),
  price: z.coerce.number().int().min(1).max(4).optional().catch(undefined),
  sort: z.enum(shopSorts).catch(DEFAULT_SHOP_SORT),
}) satisfies z.ZodType<ShopFilters, unknown>;

const offsetSchema = z.coerce.number().int().min(0).max(10_000).catch(0);

function first(params: RawParams, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseShopFilters(params: RawParams): ShopFilters {
  return shopFiltersSchema.parse({
    q: first(params, "q"),
    neighborhood: first(params, "neighborhood"),
    amenities: first(params, "amenities"),
    minRating: first(params, "minRating"),
    price: first(params, "price"),
    sort: first(params, "sort"),
  });
}

export function parseOffset(params: RawParams): number {
  return offsetSchema.parse(first(params, "offset"));
}

/** Parses a comma-separated slug list, dropping invalid entries and capping its length. */
export function parseSlugs(value: string | null | undefined, max: number): string[] {
  return [...new Set((value ?? "").split(","))].filter(isShopSlug).slice(0, max);
}
