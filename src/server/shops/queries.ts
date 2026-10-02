import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CHAPTER_CENTER, distanceInMiles } from "@/lib/geo";
import { SHOP_PAGE_SIZE } from "@/lib/shop-filters";
import type {
  Coordinates,
  ShopFilters,
  ShopOption,
  ShopPage,
  ShopSort,
  ShopView,
} from "@/types";
import { shopOptionSelect, shopViewSelect, toShopView } from "./mappers";

const MAX_PAGE_SIZE = 48;
const MAX_SHOP_OPTIONS = 500;
export const MAX_SLUG_LOOKUP = 100;
// "Nearest" ranks candidates in memory (see listNearestShops); this bounds the scan.
const NEAREST_CANDIDATE_LIMIT = 2_000;

type ListOptions = { offset?: number; limit?: number; origin?: Coordinates };

function buildWhere(filters: ShopFilters): Prisma.ShopWhereInput {
  const where: Prisma.ShopWhereInput = {};
  if (filters.q) {
    // ILIKE scans; add a pg_trgm GIN index (or full-text search) before the directory gets large.
    const contains = { contains: filters.q, mode: "insensitive" } as const;
    where.OR = [
      { name: contains },
      { neighborhood: contains },
      { description: contains },
      { specialty: contains },
      { category: contains },
    ];
  }
  if (filters.neighborhood) where.neighborhood = filters.neighborhood;
  if (filters.amenities.length)
    where.amenities = { hasEvery: filters.amenities };
  if (filters.minRating !== undefined)
    where.ratingAvg = { gte: filters.minRating };
  if (filters.price !== undefined) where.priceLevel = filters.price;
  return where;
}

// Every order ends on `id` so pages are stable when the leading keys tie.
const orderBy: Record<
  Exclude<ShopSort, "nearest">,
  Prisma.ShopOrderByWithRelationInput[]
> = {
  recommended: [
    { editorialRank: { sort: "asc", nulls: "last" } },
    { ratingAvg: "desc" },
    { id: "asc" },
  ],
  rating: [{ ratingAvg: "desc" }, { ratingCount: "desc" }, { id: "asc" }],
  name: [{ name: "asc" }, { id: "asc" }],
};

/**
 * One page of Discover results. Filtering, sorting, and paging all happen in
 * Postgres; only `limit` rows (narrow select) and a count leave the database.
 */
export async function listShops(
  filters: ShopFilters,
  options: ListOptions = {},
): Promise<ShopPage> {
  const { offset = 0, origin = CHAPTER_CENTER } = options;
  const limit = Math.min(
    Math.max(options.limit ?? SHOP_PAGE_SIZE, 1),
    MAX_PAGE_SIZE,
  );
  const where = buildWhere(filters);

  if (filters.sort === "nearest")
    return listNearestShops(where, { offset, limit, origin });

  const [rows, total] = await Promise.all([
    prisma.shop.findMany({
      where,
      orderBy: orderBy[filters.sort],
      skip: offset,
      take: limit,
      select: shopViewSelect,
    }),
    prisma.shop.count({ where }),
  ]);
  return toPage(
    rows.map((row) => toShopView(row, origin)),
    total,
    offset,
  );
}

/**
 * Distance can't be expressed as a Prisma orderBy, so rank a bounded set of
 * (id, lat, lng) candidates in memory and hydrate just the requested page.
 * Fine for a city-sized directory; switch to PostGIS KNN (`ORDER BY geog <-> point`)
 * once a single query can match more than NEAREST_CANDIDATE_LIMIT shops.
 */
async function listNearestShops(
  where: Prisma.ShopWhereInput,
  { offset, limit, origin }: Required<ListOptions>,
): Promise<ShopPage> {
  const candidates = await prisma.shop.findMany({
    where,
    select: { id: true, latitude: true, longitude: true },
    take: NEAREST_CANDIDATE_LIMIT,
  });
  if (candidates.length === NEAREST_CANDIDATE_LIMIT) {
    console.warn(
      `listNearestShops: hit the ${NEAREST_CANDIDATE_LIMIT}-candidate cap; ordering may be incomplete.`,
    );
  }
  const pageIds = candidates
    .map((candidate) => ({
      id: candidate.id,
      distance: distanceInMiles(origin, candidate),
    }))
    .sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id))
    .slice(offset, offset + limit)
    .map((candidate) => candidate.id);

  const rows = await prisma.shop.findMany({
    where: { id: { in: pageIds } },
    select: shopViewSelect,
  });
  const byId = new Map(rows.map((row) => [row.id, row]));
  const items = pageIds.flatMap((id) => {
    const row = byId.get(id);
    return row ? [toShopView(row, origin)] : [];
  });
  return toPage(items, candidates.length, offset);
}

function toPage(items: ShopView[], total: number, offset: number): ShopPage {
  const end = offset + items.length;
  return {
    items,
    total,
    nextOffset: end < total && items.length > 0 ? end : null,
  };
}

/** Memoized per request so generateMetadata and the page share one query. */
export const getShopBySlug = cache(
  async (
    slug: string,
    origin: Coordinates = CHAPTER_CENTER,
  ): Promise<ShopView | null> => {
    const row = await prisma.shop.findUnique({
      where: { slug },
      select: shopViewSelect,
    });
    return row ? toShopView(row, origin) : null;
  },
);

/** Shops for the journal (saved list, logged visits), in the order requested. */
export async function getShopsBySlugs(
  slugs: string[],
  origin: Coordinates = CHAPTER_CENTER,
): Promise<ShopView[]> {
  const unique = [...new Set(slugs)].slice(0, MAX_SLUG_LOOKUP);
  if (!unique.length) return [];
  const rows = await prisma.shop.findMany({
    where: { slug: { in: unique } },
    select: shopViewSelect,
  });
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  return unique.flatMap((slug) => {
    const row = bySlug.get(slug);
    return row ? [toShopView(row, origin)] : [];
  });
}

export const listNeighborhoods = cache(async (): Promise<string[]> => {
  const rows = await prisma.shop.findMany({
    distinct: ["neighborhood"],
    select: { neighborhood: true },
    orderBy: { neighborhood: "asc" },
  });
  return rows.map((row) => row.neighborhood);
});

/**
 * Options for the "Where did you stop?" picker. Capped: past a few hundred shops
 * the picker should become a search-as-you-type combobox backed by listShops.
 */
export async function listShopOptions(): Promise<ShopOption[]> {
  return prisma.shop.findMany({
    select: shopOptionSelect,
    orderBy: { name: "asc" },
    take: MAX_SHOP_OPTIONS,
  });
}
