import type { NextRequest } from "next/server";
import { parseSlugs } from "@/server/shops/filters";
import { getShopsBySlugs, MAX_SLUG_LOOKUP } from "@/server/shops/queries";

// GET /api/shops/lookup?slugs=a,b,c — hydrates the device-local journal's shop references.
export async function GET(request: NextRequest) {
  const slugs = parseSlugs(request.nextUrl.searchParams.get("slugs"), MAX_SLUG_LOOKUP);
  const shops = await getShopsBySlugs(slugs);
  return Response.json(shops, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
