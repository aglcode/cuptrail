import type { Shop, Visit } from '@/types';

// Sample directory from the approved Stitch screens. These are design examples,
// not verified businesses, live availability, or measured telemetry.
export const shops: Shop[] = [
  {
    id: 'kona-and-clay', name: 'Kona & Clay', neighborhood: 'East Village',
    address: '244 E 10th St, New York, NY', category: 'Ceramic atelier',
    description: 'Single-origin pour-overs, wheel-thrown ceramic mugs, and a little room to slow down. Find your corner at the sunlit ashwood tables.',
    image: '/images/kona.webp', journalImage: '/images/journal-kona.webp',
    rating: 4.9, reviews: 38, price: 2, distance: 0.2, wifi: 120,
    noise: 'Serene study', outlets: 'Every booth',
    amenities: ['wifi', 'outlets', 'quiet', 'light', 'tables'],
    roast: 'Nordic light roast', hours: '7:00 AM – 6:00 PM',
    specialty: 'Ethiopia Guji pour-over', map: [48, 34],
  },
  {
    id: 'dune-roasters', name: 'Dune Roasters', neighborhood: 'West Village',
    address: '82 W 4th St, New York, NY', category: 'Architectural loft',
    description: 'A luminous roastery with lofty skylights, a terrazzo bar, and beautifully balanced flat whites. A good place to let the morning unfold.',
    image: '/images/dune.webp', journalImage: '/images/journal-dune.webp',
    rating: 4.7, reviews: 26, price: 3, distance: 0.4, wifi: 85,
    noise: 'Calm & cozy', outlets: 'Window bench',
    amenities: ['wifi', 'outlets', 'light', 'tables'],
    roast: 'Seasonal medium roast', hours: '8:00 AM – 7:00 PM',
    specialty: 'Oat milk flat white', map: [28, 52],
  },
  {
    id: 'marrow-coffee-works', name: 'Marrow Coffee Works', neighborhood: 'Lower East Side',
    address: '128 Allen St, New York, NY', category: 'Quiet study',
    description: 'Dark walnut library tables, well-loved reading shelves, and precision-pulled cortados. Settle in for a chapter or a little deep work.',
    image: '/images/marrow.webp', journalImage: '/images/journal-marrow.webp',
    rating: 4.8, reviews: 52, price: 2, distance: 0.5, wifi: 210,
    noise: 'Soft buzz', outlets: 'Dual ports',
    amenities: ['wifi', 'outlets', 'quiet', 'tables'],
    roast: 'House espresso blend', hours: '7:30 AM – 8:00 PM',
    specialty: 'House roast cortado', map: [65, 64],
  },
  {
    id: 'linden-and-leaf', name: 'Linden & Leaf', neighborhood: 'Lower East Side',
    address: '96 Ludlow St, New York, NY', category: 'Hidden garden',
    description: 'An ivy-walled courtyard behind a neighborhood florist. Ceremonial matcha, cold brew on draft, and dappled sunlight for afternoon reading.',
    image: '/images/linden.webp', journalImage: '/images/journal-linden.webp',
    rating: 4.6, reviews: 11, price: 2, distance: 0.3, wifi: 60,
    noise: 'Whisper quiet', outlets: 'Indoor seats',
    amenities: ['outdoor', 'quiet', 'light'],
    roast: 'Light roast & matcha', hours: '8:00 AM – 7:00 PM',
    specialty: 'Ceremonial Uji matcha', map: [74, 23],
  },
  {
    id: 'ninth-street-espresso', name: 'Ninth Street Espresso', neighborhood: 'Alphabet City',
    address: '700 E 9th St, New York, NY', category: 'Neighborhood ritual',
    description: 'A classic neighborhood espresso bar. Beautifully dialed-in coffee, a standing counter, and conversations that make you put your phone away.',
    image: '/images/ninth-street.webp', journalImage: '/images/ninth-street.webp',
    rating: 4.5, reviews: 64, price: 1, distance: 0.7, wifi: 0,
    noise: 'Lively pulse', outlets: 'Limited', amenities: ['light'],
    roast: 'Classic espresso', hours: '7:00 AM – 5:00 PM',
    specialty: 'Double espresso', map: [38, 21],
  },
];

export const exampleVisits: Visit[] = [
  { id: 'example-kona', shopId: 'kona-and-clay', date: '2026-10-01T09:30:00', stars: 5, duration: 2.5, amenities: ['wifi', 'outlets', 'quiet', 'light'], orders: ['Pour-over', 'Cardamom bun'], photos: [], example: true, note: 'Incredible natural light by the front window bar. The Ethiopian natural single-origin was beautifully floral. My new morning writing spot.' },
  { id: 'example-marrow', shopId: 'marrow-coffee-works', date: '2026-09-28T14:00:00', stars: 4, duration: 3, amenities: ['wifi', 'outlets', 'tables'], orders: ['Cortado'], photos: [], example: true, note: 'Great deep work session. Reliable high-speed internet, cozy walnut tables, and a perfect cortado. Headphones helped with the afternoon buzz.' },
  { id: 'example-dune', shopId: 'dune-roasters', date: '2026-09-24T10:00:00', stars: 5, duration: 1.5, amenities: ['light', 'tables'], orders: ['Flat white', 'Cardamom bun'], photos: [], example: true, note: 'Delicious batch brew and a cardamom bun. The perfect Sunday reading nook. Stayed a little longer than planned.' },
  { id: 'example-ninth', shopId: 'ninth-street-espresso', date: '2026-09-12T08:00:00', stars: 4, duration: 0.5, amenities: ['light'], orders: ['Espresso'], photos: [], example: true, note: 'No Wi-Fi, just coffee and neighborhood conversations. A quick standing-bar visit with a beautifully pulled double shot.' },
  { id: 'example-linden', shopId: 'linden-and-leaf', date: '2026-08-30T11:00:00', stars: 5, duration: 2, amenities: ['outdoor', 'quiet'], orders: ['Matcha'], photos: [], example: true, note: 'A hidden courtyard oasis. Soft wind chimes, a slow morning matcha, and sunlight through the leaves. Bring a notebook.' },
];

export function getShop(id: string) { return shops.find(shop => shop.id === id); }
