'use client';

import { Toggle } from '@/components/ui/toggle';

import { NativeSelect } from '@/components/ui/native-select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';

import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import mascot from '@public/brand/cuptrail-mascot.png';
import { amenityOptions } from '@/lib/amenities';
import { emptyShopFilters, shopFiltersToSearchParams } from '@/lib/shop-filters';
import type { Amenity, ShopFilters, ShopPage, ShopSort, ShopView } from '@/types';
import { useJournal } from '@/components/providers/journal-provider';
import { Icon } from '@/components/ui/icon';
import { ShopCard } from './shop-card';
import { NeighborhoodMap } from './neighborhood-map';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const TOP_RATED = 4.5;
const SEARCH_DEBOUNCE_MS = 250;

function discoverHref(filters: ShopFilters) {
  const search = shopFiltersToSearchParams(filters).toString();
  return search ? `/shops?${search}` : '/shops';
}

type MoreResults = { key: string; items: ShopView[]; nextOffset: number | null };

export function Discover({ filters, page, neighborhoods }: { filters: ShopFilters; page: ShopPage; neighborhoods: string[] }) {
  const router = useRouter();
  const { notify } = useJournal();
  const [isPending, startTransition] = useTransition();
  // Filters live in the URL (shareable, filtered on the server). Apply them optimistically
  // so controls respond instantly and rapid toggles build on each other, not on stale props.
  const [current, setCurrent] = useOptimistic(filters);
  const latest = useRef(current);
  const [query, setQuery] = useState(filters.q ?? '');
  const [view, setView] = useState<'split' | 'grid' | 'map'>('split');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [more, setMore] = useState<MoreResults | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const filtersTrigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => { latest.current = current; });
  useEffect(() => {
    function shortcut(event: KeyboardEvent) { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); search.current?.focus(); } }
    window.addEventListener('keydown', shortcut);
    return () => { window.removeEventListener('keydown', shortcut); clearTimeout(searchTimer.current); };
  }, []);

  // The server-rendered first page plus any pages loaded since, for exactly these filters.
  const resultsKey = shopFiltersToSearchParams(filters).toString();
  const extra = more?.key === resultsKey ? more : null;
  const shops = extra ? [...page.items, ...extra.items] : page.items;
  const nextOffset = extra ? extra.nextOffset : page.nextOffset;
  const activeCount = current.amenities.length + Number(current.minRating !== undefined) + Number(current.price !== undefined);

  function apply(next: ShopFilters) {
    latest.current = next;
    startTransition(() => {
      setCurrent(next);
      router.replace(discoverHref(next), { scroll: false });
    });
  }
  function navigate(changes: Partial<ShopFilters>) { apply({ ...latest.current, ...changes }); }
  function changeQuery(value: string) {
    setQuery(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => navigate({ q: value.trim() || undefined }), SEARCH_DEBOUNCE_MS);
  }
  function toggleFilter(id: Amenity) {
    const { amenities } = latest.current;
    navigate({ amenities: amenities.includes(id) ? amenities.filter(item => item !== id) : [...amenities, id] });
  }
  function toggleRating() { navigate({ minRating: latest.current.minRating === undefined ? TOP_RATED : undefined }); }
  function resetFilters() {
    clearTimeout(searchTimer.current);
    setQuery('');
    // Replace, don't merge: merging would keep any filter emptyShopFilters leaves unset.
    apply({ ...emptyShopFilters, sort: latest.current.sort });
  }
  async function loadMore() {
    if (nextOffset === null) return;
    const key = resultsKey;
    setLoadingMore(true);
    try {
      const params = shopFiltersToSearchParams(filters);
      params.set('offset', String(nextOffset));
      const response = await fetch(`/api/shops?${params}`);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const next: ShopPage = await response.json();
      setMore(previous => ({ key, items: [...(previous?.key === key ? previous.items : []), ...next.items], nextOffset: next.nextOffset }));
    } catch {
      notify('More coffee shops could not load. Try again in a moment.');
    } finally {
      setLoadingMore(false);
    }
  }

  return <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
    <main id="main-content" className={view === 'grid' ? 'discovery-grid' : undefined}>
    <div className="page-width discovery-main">
      <div className="discovery-heading">
        <div className="welcome-copy"><p className="eyebrow"><Icon name="compass" size={16}/>Your coffee companion</p><h1>Find your next coffee corner.</h1><p className="heading-description">Good coffee, a comfortable seat, and somewhere to stay a while. Find a spot that feels like you.</p><span className="directory-badge"><span className="sample-dot"/>New York chapter · Sample directory</span></div>
        <div className="welcome-mascot"><Image src={mascot} alt="" width={232} height={232} sizes="(max-width: 359px) 88px, (max-width: 639px) 108px, (max-width: 767px) 140px, (max-width: 1023px) 196px, 232px" preload/></div>
      </div>
    </div>
    <div className="discovery-toolbar"><div className="page-width">
      <div className="search-row">
        <label className="region-select"><Icon name="compass" className="text-primary" size={21}/><span><span className="eyebrow">Explore a neighborhood</span><NativeSelect aria-label="Neighborhood" value={current.neighborhood ?? 'all'} onChange={event => navigate({ neighborhood: event.target.value === 'all' ? undefined : event.target.value })}><option value="all">New York, NY</option>{neighborhoods.map(item => <option key={item}>{item}</option>)}</NativeSelect></span></label>
        <div className="search-control"><label htmlFor="shop-search" className="eyebrow">Search coffee shops</label><div className="search-field"><Icon name="search" size={20}/><Input className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 h-auto" id="shop-search" ref={search} type="search" value={query} onChange={event => changeQuery(event.target.value)} placeholder="Name, neighborhood, or coffee…"/><kbd>Ctrl / ⌘ K</kbd></div></div>
        <div className="view-toggle desktop-view" aria-label="Discovery layout"><Toggle className="text-foreground" variant="default" pressed={view === 'split'} onPressedChange={() => setView('split')}><Icon name="split" size={16}/>Split view</Toggle><Toggle className="text-foreground" variant="default" pressed={view === 'grid'} onPressedChange={() => setView('grid')}><Icon name="grid" size={16}/>Grid only</Toggle></div>
      </div>
      <div className="filter-bar"><Toggle variant="outline" className={`filter-chip`} pressed={current.minRating !== undefined} onPressedChange={toggleRating}><Icon name="star" size={14} fill/>4.5+ rating</Toggle>{amenityOptions.slice(0, 5).map(option => <Toggle variant="outline" key={option.id} className={`filter-chip`} pressed={current.amenities.includes(option.id)} onPressedChange={() => toggleFilter(option.id)}><Icon name={option.icon} size={15}/>{option.label}</Toggle>)}<Button variant="outline" ref={filtersTrigger} className="filter-chip all-filters" onClick={() => setFiltersOpen(true)}><Icon name="sliders" size={16}/>All filters{activeCount > 0 && ` (${activeCount})`}</Button>{activeCount > 0 && <Button variant="ghost" className="filter-clear" onClick={resetFilters}>Clear</Button>}</div>
    </div></div>
    <div className={`page-width discovery-results transition-opacity ${isPending ? 'opacity-60' : ''}`} aria-busy={isPending}>
      <div className="results-toolbar"><p aria-live="polite"><strong>{page.total}</strong> {page.total === 1 ? 'place' : 'places'} to make your own</p><div className="flex items-center gap-3"><label className="sort-control"><span>Sort:</span><NativeSelect aria-label="Sort coffee shops" value={current.sort} onChange={event => navigate({ sort: event.target.value as ShopSort })}><option value="recommended">Our picks</option><option value="rating">Highest rated</option><option value="nearest">Nearest first</option><option value="name">Name A–Z</option></NativeSelect></label><Toggle variant="default" className="mobile-map-toggle lg:hidden" pressed={view === 'map'} onPressedChange={() => setView(value => value === 'map' ? 'split' : 'map')}><Icon name={view === 'map' ? 'list' : 'pin'} size={15}/>{view === 'map' ? 'List' : 'Map'}</Toggle></div></div>
      <div className={`discovery-layout ${view === 'map' ? 'mobile-map-view' : ''}`}>
        <div className="shop-results">
          <div className="shop-list">{shops.map((shop, index) => <ShopCard shop={shop} key={shop.slug} featured={index === 0} grid={view === 'grid'}/>)}</div>
          {nextOffset !== null && <div className="flex justify-center"><Button variant="outline" className="button button-white" disabled={loadingMore} onClick={loadMore}>{loadingMore ? 'Loading more places…' : 'Show more places'}<Icon name="arrow" size={15}/></Button></div>}
          {shops.length === 0 && <div className="empty-state"><Icon name="search" size={34}/><h2>No shops match your search.</h2><p>Try another neighborhood or reset your filters.</p><Button variant="default" className="button button-dark" onClick={resetFilters}>Reset search & filters</Button></div>}
          <div className="discovery-note"><div className="note-icon"><Icon name="book" size={23}/></div><div><h2>A good spot is worth remembering.</h2><p>Save the details of your visit in your private journal.</p></div><LinkButton variant="outline" href="/log-visit" className="button button-white">Log a visit<Icon name="arrow" size={15}/></LinkButton></div>
        </div>
        {view !== 'grid' && <aside className="discovery-map"><NeighborhoodMap shops={shops}/><div className="map-footnote"><Icon name="compass" size={16}/><p>Follow your curiosity. The best spot is the one that feels like you.</p></div></aside>}
      </div>
      <p className="sample-disclosure">Explore the sample shops from our design collection. Ratings, amenities, and distances are illustrative.</p>
    </div>
    </main>
    <DialogContent finalFocus={filtersTrigger} className="filter-dialog sm:max-w-xl block" showCloseButton={false}><DialogDescription className="sr-only">Choose amenities and a price range to filter coffee shops.</DialogDescription><div className="flex items-center justify-between mb-6"><DialogTitle className="text-2xl">Your kind of coffee spot.</DialogTitle><Button variant="secondary" className="icon-button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><Icon name="close"/></Button></div><fieldset><legend className="field-label mb-3">Make yourself comfortable</legend><div className="grid grid-cols-2 gap-2">{amenityOptions.map(option => <label className="checkbox-tile" key={option.id}><Checkbox aria-label={option.label} checked={current.amenities.includes(option.id)} onCheckedChange={() => toggleFilter(option.id)}/><Icon name={option.icon}/>{option.label}</label>)}</div></fieldset><label className="field-label mt-6 block" htmlFor="price-filter">Price range</label><NativeSelect id="price-filter" className="form-input mt-2 w-full" value={current.price === undefined ? 'all' : String(current.price)} onChange={event => navigate({ price: event.target.value === 'all' ? undefined : Number(event.target.value) })}><option value="all">Any price</option><option value="1">$ · Easy on the wallet</option><option value="2">$$ · A little treat</option><option value="3">$$$ · Something special</option></NativeSelect><div className="flex justify-between mt-8"><Button variant="secondary" className="button button-soft" onClick={resetFilters}>Reset filters</Button><Button variant="default" className="button button-accent" onClick={() => setFiltersOpen(false)}>Show {page.total} places<Icon name="arrow" size={16}/></Button></div></DialogContent>
  </Dialog>;
}
