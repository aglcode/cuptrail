import type { Coordinates } from "@/types";

/** Default search origin until we ask for the visitor's location: the New York chapter. */
export const CHAPTER_CENTER: Coordinates = { latitude: 40.7265, longitude: -73.9815 };

const EARTH_RADIUS_MILES = 3958.8;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle (haversine) distance in miles. */
export function distanceInMiles(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}
