import type { SVGProps } from 'react';
import {
  Search, MapPin, Compass, Plus, Minus, BookOpen, Bookmark, Star, Wifi,
  Plug, Volume2, Leaf, Sun, Table2, Coffee, Clock, ArrowRight, ArrowLeft,
  ChevronDown, X, Grid2X2, PanelsLeftBottom, List, SlidersHorizontal,
  UserRound, Check, Share2, Camera, Download, LockKeyhole, Award,
  CalendarDays, RotateCcw, ExternalLink,
} from 'lucide-react';

const paths = {
  search: Search, pin: MapPin, compass: Compass, plus: Plus, minus: Minus,
  book: BookOpen, bookmark: Bookmark, star: Star, wifi: Wifi, plug: Plug,
  volume: Volume2, leaf: Leaf, sun: Sun, table: Table2, coffee: Coffee,
  clock: Clock, arrow: ArrowRight, back: ArrowLeft, chevron: ChevronDown,
  close: X, grid: Grid2X2, split: PanelsLeftBottom, list: List,
  sliders: SlidersHorizontal, user: UserRound, check: Check, share: Share2,
  camera: Camera, download: Download, lock: LockKeyhole, award: Award,
  calendar: CalendarDays, reset: RotateCcw, external: ExternalLink,
};

export type IconName = keyof typeof paths;
export function Icon({ name, size = 18, fill = false, ...props }: Omit<SVGProps<SVGSVGElement>, 'fill'> & { name: IconName; size?: number; fill?: boolean }) {
  const LucideIcon = paths[name];
  return <LucideIcon size={size} fill={fill ? 'currentColor' : 'none'} strokeWidth={1.75} aria-hidden="true" {...props}/>;
}
