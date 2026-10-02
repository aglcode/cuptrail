import type { Amenity } from "@/types";
import type { IconName } from "@/components/ui/icon";

type AmenityOption = { id: Amenity; label: string; icon: IconName };

export const amenityOptions = [
  { id: "wifi", label: "Fast Wi-Fi", icon: "wifi" },
  { id: "outlets", label: "Power outlets", icon: "plug" },
  { id: "quiet", label: "Quiet corners", icon: "volume" },
  { id: "outdoor", label: "Outdoor seating", icon: "leaf" },
  { id: "light", label: "Natural light", icon: "sun" },
  { id: "tables", label: "Spacious tables", icon: "table" },
] as const satisfies readonly AmenityOption[];

export const amenityIds: readonly Amenity[] = amenityOptions.map(option => option.id);

export function isAmenity(value: unknown): value is Amenity {
  return typeof value === "string" && (amenityIds as readonly string[]).includes(value);
}
