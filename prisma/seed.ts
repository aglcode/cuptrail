// Seeds the sample New York directory from the approved Stitch screens.
// These are design examples, not verified businesses: coordinates are approximate,
// and ratings/Wi-Fi/hours are illustrative. Safe to re-run (upserts by slug).
//
// Run with: npm run db:seed
import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, type Amenity, type Prisma } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// A one-off script gets its own client; app code must use src/lib/prisma.ts.
const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

type SeedShop = Omit<
  Prisma.ShopCreateInput,
  "amenities" | "ratingSum" | "ratingCount" | "ratingAvg"
> & {
  amenities: Amenity[];
  sampleRating: number;
  sampleReviews: number;
};

const shops: SeedShop[] = [
  {
    slug: "kona-and-clay",
    name: "Kona & Clay",
    neighborhood: "East Village",
    address: "244 E 10th St, New York, NY",
    category: "Ceramic atelier",
    description:
      "Single-origin pour-overs, wheel-thrown ceramic mugs, and a little room to slow down. Find your corner at the sunlit ashwood tables.",
    latitude: 40.729,
    longitude: -73.9855,
    photoUrl: "/images/kona.webp",
    journalPhotoUrl: "/images/journal-kona.webp",
    sampleRating: 4.9,
    sampleReviews: 38,
    priceLevel: 2,
    wifiMbps: 120,
    atmosphere: "Serene study",
    outletsNote: "Every booth",
    amenities: ["wifi", "outlets", "quiet", "light", "tables"],
    roast: "Nordic light roast",
    hours: "7:00 AM – 6:00 PM",
    specialty: "Ethiopia Guji pour-over",
    mapX: 48,
    mapY: 34,
  },
  {
    slug: "dune-roasters",
    name: "Dune Roasters",
    neighborhood: "West Village",
    address: "82 W 4th St, New York, NY",
    category: "Architectural loft",
    description:
      "A luminous roastery with lofty skylights, a terrazzo bar, and beautifully balanced flat whites. A good place to let the morning unfold.",
    latitude: 40.729,
    longitude: -73.9975,
    photoUrl: "/images/dune.webp",
    journalPhotoUrl: "/images/journal-dune.webp",
    sampleRating: 4.7,
    sampleReviews: 26,
    priceLevel: 3,
    wifiMbps: 85,
    atmosphere: "Calm & cozy",
    outletsNote: "Window bench",
    amenities: ["wifi", "outlets", "light", "tables"],
    roast: "Seasonal medium roast",
    hours: "8:00 AM – 7:00 PM",
    specialty: "Oat milk flat white",
    mapX: 28,
    mapY: 52,
  },
  {
    slug: "marrow-coffee-works",
    name: "Marrow Coffee Works",
    neighborhood: "Lower East Side",
    address: "128 Allen St, New York, NY",
    category: "Quiet study",
    description:
      "Dark walnut library tables, well-loved reading shelves, and precision-pulled cortados. Settle in for a chapter or a little deep work.",
    latitude: 40.72,
    longitude: -73.9896,
    photoUrl: "/images/marrow.webp",
    journalPhotoUrl: "/images/journal-marrow.webp",
    sampleRating: 4.8,
    sampleReviews: 52,
    priceLevel: 2,
    wifiMbps: 210,
    atmosphere: "Soft buzz",
    outletsNote: "Dual ports",
    amenities: ["wifi", "outlets", "quiet", "tables"],
    roast: "House espresso blend",
    hours: "7:30 AM – 8:00 PM",
    specialty: "House roast cortado",
    mapX: 65,
    mapY: 64,
  },
  {
    slug: "linden-and-leaf",
    name: "Linden & Leaf",
    neighborhood: "Lower East Side",
    address: "96 Ludlow St, New York, NY",
    category: "Hidden garden",
    description:
      "An ivy-walled courtyard behind a neighborhood florist. Ceremonial matcha, cold brew on draft, and dappled sunlight for afternoon reading.",
    latitude: 40.718,
    longitude: -73.9885,
    photoUrl: "/images/linden.webp",
    journalPhotoUrl: "/images/journal-linden.webp",
    sampleRating: 4.6,
    sampleReviews: 11,
    priceLevel: 2,
    wifiMbps: 60,
    atmosphere: "Whisper quiet",
    outletsNote: "Indoor seats",
    amenities: ["outdoor", "quiet", "light"],
    roast: "Light roast & matcha",
    hours: "8:00 AM – 7:00 PM",
    specialty: "Ceremonial Uji matcha",
    mapX: 74,
    mapY: 23,
  },
  {
    slug: "ninth-street-espresso",
    name: "Ninth Street Espresso",
    neighborhood: "Alphabet City",
    address: "700 E 9th St, New York, NY",
    category: "Neighborhood ritual",
    description:
      "A classic neighborhood espresso bar. Beautifully dialed-in coffee, a standing counter, and conversations that make you put your phone away.",
    latitude: 40.7255,
    longitude: -73.9775,
    photoUrl: "/images/ninth-street.webp",
    journalPhotoUrl: "/images/ninth-street.webp",
    sampleRating: 4.5,
    sampleReviews: 64,
    priceLevel: 1,
    wifiMbps: 0,
    atmosphere: "Lively pulse",
    outletsNote: "Limited",
    amenities: ["light"],
    roast: "Classic espresso",
    hours: "7:00 AM – 5:00 PM",
    specialty: "Double espresso",
    mapX: 38,
    mapY: 21,
  },
];

async function main() {
  for (const [
    index,
    { sampleRating, sampleReviews, ...shop },
  ] of shops.entries()) {
    // Sample aggregates stand in for real Rating rows until users rate these shops.
    const ratingSum = Math.round(sampleRating * sampleReviews);
    const data = {
      ...shop,
      editorialRank: index + 1,
      ratingSum,
      ratingCount: sampleReviews,
      ratingAvg: ratingSum / sampleReviews,
    };
    await prisma.shop.upsert({
      where: { slug: shop.slug },
      update: data,
      create: data,
    });
  }
  console.log(`Seeded ${shops.length} sample shops.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
