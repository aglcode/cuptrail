'use client';

import { Toggle } from '@/components/ui/toggle';

import { NativeSelect } from '@/components/ui/native-select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import mascot from '@public/brand/cuptrail-mascot.png';
import { shops } from '@/lib/coffee-data';
import { amenityOptions } from '@/lib/amenities';
import type { Amenity } from '@/types';
import { Icon } from '@/components/ui/icon';
import { ShopCard } from './shop-card';
import { NeighborhoodMap } from './neighborhood-map';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

export function Discover() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Amenity[]>([]);
  const [rating, setRating] = useState(false);
  const [neighborhood, setNeighborhood] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [view, setView] = useState<'split' | 'grid' | 'map'>('split');
  const [price, setPrice] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersTrigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function shortcut(event: KeyboardEvent) { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); search.current?.focus(); } }
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  const filtered = shops.filter(shop => {
    const text = `${shop.name} ${shop.neighborhood} ${shop.description} ${shop.specialty} ${shop.category}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (!rating || shop.rating >= 4.5) && filters.every(filter => shop.amenities.includes(filter)) && (neighborhood === 'all' || shop.neighborhood === neighborhood) && (price === 'all' || shop.price === Number(price));
  }).sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'nearest' ? a.distance - b.distance : sort === 'name' ? a.name.localeCompare(b.name) : shops.indexOf(a) - shops.indexOf(b));
  const activeCount = filters.length + Number(rating) + Number(price !== 'all');
  function toggleFilter(id: Amenity) { setFilters(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]); }
  function resetFilters() { setFilters([]); setRating(false); setPrice('all'); setNeighborhood('all'); setQuery(''); }

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
        <label className="region-select"><Icon name="compass" className="text-primary" size={21}/><span><span className="eyebrow">Explore a neighborhood</span><NativeSelect aria-label="Neighborhood" value={neighborhood} onChange={event => setNeighborhood(event.target.value)}><option value="all">New York, NY</option>{Array.from(new Set(shops.map(shop => shop.neighborhood))).map(item => <option key={item}>{item}</option>)}</NativeSelect></span></label>
        <div className="search-control"><label htmlFor="shop-search" className="eyebrow">Search coffee shops</label><div className="search-field"><Icon name="search" size={20}/><Input className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 h-auto" id="shop-search" ref={search} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, neighborhood, or coffee…"/><kbd>Ctrl / ⌘ K</kbd></div></div>
        <div className="view-toggle desktop-view" aria-label="Discovery layout"><Toggle className="text-foreground" variant="default" pressed={view === 'split'} onPressedChange={() => setView('split')}><Icon name="split" size={16}/>Split view</Toggle><Toggle className="text-foreground" variant="default" pressed={view === 'grid'} onPressedChange={() => setView('grid')}><Icon name="grid" size={16}/>Grid only</Toggle></div>
      </div>
      <div className="filter-bar"><Toggle variant="outline" className={`filter-chip`} pressed={rating} onPressedChange={() => setRating(value => !value)}><Icon name="star" size={14} fill/>4.5+ rating</Toggle>{amenityOptions.slice(0, 5).map(option => <Toggle variant="outline" key={option.id} className={`filter-chip`} pressed={filters.includes(option.id)} onPressedChange={() => toggleFilter(option.id)}><Icon name={option.icon} size={15}/>{option.label}</Toggle>)}<Button variant="outline" ref={filtersTrigger} className="filter-chip all-filters" onClick={() => setFiltersOpen(true)}><Icon name="sliders" size={16}/>All filters{activeCount > 0 && ` (${activeCount})`}</Button>{activeCount > 0 && <Button variant="ghost" className="filter-clear" onClick={resetFilters}>Clear</Button>}</div>
    </div></div>
    <div className="page-width discovery-results">
      <div className="results-toolbar"><p aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? 'place' : 'places'} to make your own</p><div className="flex items-center gap-3"><label className="sort-control"><span>Sort:</span><NativeSelect aria-label="Sort coffee shops" value={sort} onChange={event => setSort(event.target.value)}><option value="recommended">Our picks</option><option value="rating">Highest rated</option><option value="nearest">Nearest first</option><option value="name">Name A–Z</option></NativeSelect></label><Toggle variant="default" className="mobile-map-toggle lg:hidden" pressed={view === 'map'} onPressedChange={() => setView(value => value === 'map' ? 'split' : 'map')}><Icon name={view === 'map' ? 'list' : 'pin'} size={15}/>{view === 'map' ? 'List' : 'Map'}</Toggle></div></div>
      <div className={`discovery-layout ${view === 'map' ? 'mobile-map-view' : ''}`}>
        <div className="shop-results">
          <div className="shop-list">{filtered.map((shop, index) => <ShopCard shop={shop} key={shop.id} featured={index === 0} grid={view === 'grid'}/>)}</div>
          {filtered.length === 0 && <div className="empty-state"><Icon name="search" size={34}/><h2>No shops match your search.</h2><p>Try another neighborhood or reset your filters.</p><Button variant="default" className="button button-dark" onClick={resetFilters}>Reset search & filters</Button></div>}
          <div className="discovery-note"><div className="note-icon"><Icon name="book" size={23}/></div><div><h2>A good spot is worth remembering.</h2><p>Save the details of your visit in your private journal.</p></div><LinkButton variant="outline" href="/log-visit" className="button button-white">Log a visit<Icon name="arrow" size={15}/></LinkButton></div>
        </div>
        {view !== 'grid' && <aside className="discovery-map"><NeighborhoodMap shops={filtered}/><div className="map-footnote"><Icon name="compass" size={16}/><p>Follow your curiosity. The best spot is the one that feels like you.</p></div></aside>}
      </div>
      <p className="sample-disclosure">Explore the sample shops from our design collection. Ratings, amenities, and distances are illustrative.</p>
    </div>
    </main>
    <DialogContent finalFocus={filtersTrigger} className="filter-dialog sm:max-w-xl block" showCloseButton={false}><DialogDescription className="sr-only">Choose amenities and a price range to filter coffee shops.</DialogDescription><div className="flex items-center justify-between mb-6"><DialogTitle className="text-2xl">Your kind of coffee spot.</DialogTitle><Button variant="secondary" className="icon-button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><Icon name="close"/></Button></div><fieldset><legend className="field-label mb-3">Make yourself comfortable</legend><div className="grid grid-cols-2 gap-2">{amenityOptions.map(option => <label className="checkbox-tile" key={option.id}><Checkbox aria-label={option.label} checked={filters.includes(option.id)} onCheckedChange={() => toggleFilter(option.id)}/><Icon name={option.icon}/>{option.label}</label>)}</div></fieldset><label className="field-label mt-6 block" htmlFor="price-filter">Price range</label><NativeSelect id="price-filter" className="form-input mt-2 w-full" value={price} onChange={event => setPrice(event.target.value)}><option value="all">Any price</option><option value="1">$ · Easy on the wallet</option><option value="2">$$ · A little treat</option><option value="3">$$$ · Something special</option></NativeSelect><div className="flex justify-between mt-8"><Button variant="secondary" className="button button-soft" onClick={resetFilters}>Reset filters</Button><Button variant="default" className="button button-accent" onClick={() => setFiltersOpen(false)}>Show {filtered.length} places<Icon name="arrow" size={16}/></Button></div></DialogContent>
  </Dialog>;
}
