import type { SVGProps } from 'react';

const paths = {
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  minus: <path d="M5 12h14"/>,
  book: <><path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4V4ZM20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h3V4Z"/></>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z"/>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9L7.5 14 3 9.6l6.2-.9L12 3Z"/>,
  wifi: <><path d="M3 8a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r=".7" fill="currentColor"/></>,
  plug: <><path d="M8 3v5M16 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5"/></>,
  volume: <><path d="M11 4 6 8H3v8h3l5 4V4ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></>,
  leaf: <><path d="M20 3C7 2 2 8 5 15s16 7 15-12ZM5 20 16 9"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></>,
  table: <><path d="M3 7h18v5H3V7ZM5 12v9M19 12v9M9 12v6M15 12v6"/></>,
  coffee: <><path d="M4 9h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9ZM17 9h2a3 3 0 0 1 0 6h-2M7 3v3M12 3v3"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  back: <path d="M20 12H4m6-6-6 6 6 6"/>,
  chevron: <path d="m6 9 6 6 6-6"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  split: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M13 3v18M3 9h10M3 15h10"/></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13M3 6h.1M3 12h.1M3 18h.1"/></>,
  sliders: <><path d="M4 6h7M15 6h5M4 18h3M11 18h9"/><circle cx="13" cy="6" r="2"/><circle cx="9" cy="18" r="2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  share: <><circle cx="18" cy="4" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="20" r="3"/><path d="m8.5 10.5 7-5M8.5 13.5l7 5"/></>,
  camera: <><path d="M3 7h4l2-3h6l2 3h4v14H3V7Z"/><circle cx="12" cy="13" r="4"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
  award: <><circle cx="12" cy="8" r="5"/><path d="m8 12-2 9 6-3 6 3-2-9"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
  reset: <><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/></>,
  external: <><path d="M14 3h7v7M21 3 11 13M10 3H3v18h18v-7"/></>,
} satisfies Record<string, React.ReactNode>;

export type IconName = keyof typeof paths;
export function Icon({ name, size = 18, fill = false, ...props }: Omit<SVGProps<SVGSVGElement>, 'fill'> & { name: IconName; size?: number; fill?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
