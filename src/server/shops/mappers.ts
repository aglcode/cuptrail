import "server-only";
import type { Prisma } from "@prisma/client";
import { distanceInMiles } from "@/lib/geo";
import type { Coordinates, ShopView } from "@/types";

const PLACEHOLDER_IMAGE = "/images/pour-over.webp";

/** Columns the UI needs. Keep list queries on this select, never the full row. */
export const shopViewSelect = {
  id: true, slug: true, name: true, neighborhood: true, address: true,
  description: true, category: true, latitude: true, longitude: true,
  amenities: true, priceLevel: true, photoUrl: true, journalPhotoUrl: true,
  wifiMbps: true, atmosphere: true, outletsNote: true, roast: true,
  hours: true, specialty: true, mapX: true, mapY: true,
  ratingAvg: true, ratingCount: true,
} satisfies Prisma.ShopSelect;

export const shopOptionSelect = { slug: true, name: true, neighborhood: true } satisfies Prisma.ShopSelect;

type ShopViewRow = Prisma.ShopGetPayload<{ select: typeof shopViewSelect }>;

export function toShopView(row: ShopViewRow, origin: Coordinates): ShopView {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    neighborhood: row.neighborhood,
    address: row.address,
    description: row.description,
    category: row.category,
    image: row.photoUrl ?? PLACEHOLDER_IMAGE,
    journalImage: row.journalPhotoUrl ?? row.photoUrl ?? PLACEHOLDER_IMAGE,
    rating: Math.round(row.ratingAvg * 10) / 10,
    reviews: row.ratingCount,
    price: row.priceLevel ?? 0,
    distance: Math.round(distanceInMiles(origin, row) * 10) / 10,
    wifi: row.wifiMbps ?? 0,
    noise: row.atmosphere ?? "",
    outlets: row.outletsNote ?? "",
    // Type-checks only while the Prisma enum matches the app's Amenity union.
    amenities: row.amenities,
    roast: row.roast ?? "",
    hours: row.hours ?? "",
    specialty: row.specialty ?? "",
    map: row.mapX !== null && row.mapY !== null ? [row.mapX, row.mapY] : null,
  };
}
