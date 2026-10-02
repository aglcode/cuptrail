// Shared app-level types. Database row types come from Prisma (`@prisma/client`)
// and stay on the server; these are the shapes the UI consumes.

export type Amenity = "wifi" | "outlets" | "quiet" | "outdoor" | "light" | "tables";

export type Shop = {
  id: string; name: string; neighborhood: string; address: string;
  description: string; category: string; image: string; journalImage: string;
  rating: number; reviews: number; price: number; distance: number;
  wifi: number; noise: string; outlets: string; amenities: Amenity[];
  roast: string; hours: string; specialty: string; map: [number, number];
};

// The journal is stored client-side (localStorage) for now, keyed by shop.
export type Visit = {
  id: string; shopId: string; date: string; stars: number; note: string;
  duration: number; amenities: Amenity[]; orders: string[];
  photos: string[]; example?: boolean;
};
export type VisitDraft = Omit<Visit, "id" | "example">;
