// Shared app-level types. Database row types come from Prisma (`@prisma/client`)
// and stay on the server; these are the shapes the UI consumes.

export type Amenity = "wifi" | "outlets" | "quiet" | "outdoor" | "light" | "tables";

export type Coordinates = { latitude: number; longitude: number };

/** A shop as rendered by the UI. Mapped from the DB row in src/server/shops/mappers.ts. */
export type ShopView = {
  id: string;
  slug: string;
  name: string;
  neighborhood: string;
  address: string;
  description: string;
  category: string;
  image: string;
  journalImage: string;
  rating: number;
  reviews: number;
  price: number;
  /** Miles from the search origin, one decimal. */
  distance: number;
  wifi: number;
  noise: string;
  outlets: string;
  amenities: Amenity[];
  roast: string;
  hours: string;
  specialty: string;
  /** Pin position (%) on the illustrated map, or null when the shop has none. */
  map: [number, number] | null;
};

/** @deprecated Static sample-data shape (id = slug); removed once the UI reads ShopView. */
export type Shop = Omit<ShopView, "slug" | "map"> & { map: [number, number] };

/** Just enough to pick a shop from a list. */
export type ShopOption = Pick<ShopView, "slug" | "name" | "neighborhood">;

export type ShopSort = "recommended" | "rating" | "nearest" | "name";

export type ShopFilters = {
  q?: string;
  neighborhood?: string;
  amenities: Amenity[];
  minRating?: number;
  price?: number;
  sort: ShopSort;
};

/** One page of an offset-paginated shop listing. */
export type ShopPage = {
  items: ShopView[];
  total: number;
  /** Offset for the next page, or null when this is the last one. */
  nextOffset: number | null;
};

// The journal is stored client-side (localStorage) for now, keyed by shop slug.
export type Visit = {
  id: string;
  shopId: string;
  date: string;
  stars: number;
  note: string;
  duration: number;
  amenities: Amenity[];
  orders: string[];
  photos: string[];
  example?: boolean;
};
export type VisitDraft = Omit<Visit, "id" | "example">;
