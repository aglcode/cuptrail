import type { NextRequest } from "next/server";
import { parseOffset, parseShopFilters } from "@/server/shops/filters";
import { listShops } from "@/server/shops/queries";

// GET /api/shops?q=&neighborhood=&amenities=&minRating=&price=&sort=&offset=
// Public, user-independent data: let the CDN absorb repeated "load more" requests.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = await listShops(parseShopFilters(params), {
    offset: parseOffset(params),
  });
  return Response.json(page, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
