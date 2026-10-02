'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import mascot from '@/public/brand/cuptrail-mascot.png';
import { shops, amenityOptions, type Amenity } from '@/lib/coffee-data';
import { Icon } from './icon';
import { ShopCard } from './shop-card';
import { NeighborhoodMap } from './neighborhood-map';
import { Dialog } from './dialog';

export function Discover() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Amenity[]>([]);
  const [rating, setRating] = useState(false);
  const [neighborhood, setNeighborhood] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [view, setView] = useState<'split' | 'grid' | 'map'>('split');
  const [price, setPrice] = useState('all');
  const dialog = useRef<HTMLDialogElement>(null);
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

  return <>
    <main id="main-content" className={view === 'grid' ? 'discovery-grid' : undefined}>
    <div className="page-width discovery-main">
      <div className="discovery-heading">
        <div className="welcome-copy"><p className="eyebrow"><Icon name="compass" size={16}/>Your coffee companion</p><h1>Find your next coffee corner.</h1><p className="heading-description">Good coffee, a comfortable seat, and somewhere to stay a while. Find a spot that feels like you.</p><span className="directory-badge"><span className="sample-dot"/>New York chapter · Sample directory</span></div>
        <div className="welcome-mascot"><Image src={mascot} alt="" width={232} height={232} sizes="(max-width: 359px) 88px, (max-width: 639px) 108px, (max-width: 767px) 140px, (max-width: 1023px) 196px, 232px" preload/></div>
      </div>
    </div>
    <div className="discovery-toolbar"><div className="page-width">
      <div className="search-row">
        <label className="region-select"><Icon name="compass" className="text-accent" size={21}/><span><span className="eyebrow">Explore a neighborhood</span><select aria-label="Neighborhood" value={neighborhood} onChange={event => setNeighborhood(event.target.value)}><option value="all">New York, NY</option>{Array.from(new Set(shops.map(shop => shop.neighborhood))).map(item => <option key={item}>{item}</option>)}</select></span></label>
        <div className="search-control"><label htmlFor="shop-search" className="eyebrow">Search coffee shops</label><div className="search-field"><Icon name="search" size={20}/><input id="shop-search" ref={search} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, neighborhood, or coffee…"/><kbd>Ctrl / ⌘ K</kbd></div></div>
        <div className="view-toggle desktop-view" aria-label="Discovery layout"><button aria-pressed={view === 'split'} onClick={() => setView('split')}><Icon name="split" size={16}/>Split view</button><button aria-pressed={view === 'grid'} onClick={() => setView('grid')}><Icon name="grid" size={16}/>Grid only</button></div>
      </div>
      <div className="filter-bar"><button className={`filter-chip ${rating ? 'active' : ''}`} aria-pressed={rating} onClick={() => setRating(value => !value)}><Icon name="star" size={14} fill/>4.5+ rating</button>{amenityOptions.slice(0, 5).map(option => <button key={option.id} className={`filter-chip ${filters.includes(option.id) ? 'active' : ''}`} aria-pressed={filters.includes(option.id)} onClick={() => toggleFilter(option.id)}><Icon name={option.icon} size={15}/>{option.label}</button>)}<button className="filter-chip all-filters" onClick={() => dialog.current?.showModal()}><Icon name="sliders" size={16}/>All filters{activeCount > 0 && ` (${activeCount})`}</button>{activeCount > 0 && <button className="filter-clear" onClick={resetFilters}>Clear</button>}</div>
    </div></div>
    <div className="page-width discovery-results">
      <div className="results-toolbar"><p aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? 'place' : 'places'} to make your own</p><div className="flex items-center gap-3"><label className="sort-control"><span>Sort:</span><select aria-label="Sort coffee shops" value={sort} onChange={event => setSort(event.target.value)}><option value="recommended">Our picks</option><option value="rating">Highest rated</option><option value="nearest">Nearest first</option><option value="name">Name A–Z</option></select></label><button className="mobile-map-toggle" aria-pressed={view === 'map'} onClick={() => setView(value => value === 'map' ? 'split' : 'map')}><Icon name={view === 'map' ? 'list' : 'pin'} size={15}/>{view === 'map' ? 'List' : 'Map'}</button></div></div>
      <div className={`discovery-layout ${view === 'map' ? 'mobile-map-view' : ''}`}>
        <div className="shop-results">
          <div className="shop-list">{filtered.map((shop, index) => <ShopCard shop={shop} key={shop.id} featured={index === 0} grid={view === 'grid'}/>)}</div>
          {filtered.length === 0 && <div className="empty-state"><Icon name="search" size={34}/><h2>No shops match your search.</h2><p>Try another neighborhood or reset your filters.</p><button className="button button-dark" onClick={resetFilters}>Reset search & filters</button></div>}
          <div className="discovery-note"><div className="note-icon"><Icon name="book" size={23}/></div><div><h2>A good spot is worth remembering.</h2><p>Save the details of your visit in your private journal.</p></div><Link href="/log-visit" className="button button-white">Log a visit<Icon name="arrow" size={15}/></Link></div>
        </div>
        {view !== 'grid' && <aside className="discovery-map"><NeighborhoodMap shops={filtered}/><div className="map-footnote"><Icon name="compass" size={16}/><p>Follow your curiosity. The best spot is the one that feels like you.</p></div></aside>}
      </div>
      <p className="sample-disclosure">Explore the sample shops from our design collection. Ratings, amenities, and distances are illustrative.</p>
    </div>
    </main>
    <Dialog ref={dialog} className="filter-dialog" aria-labelledby="filter-title"><div className="flex items-center justify-between mb-6"><h2 id="filter-title" className="text-2xl">Your kind of coffee spot.</h2><button className="icon-button" aria-label="Close filters" onClick={() => dialog.current?.close()}><Icon name="close"/></button></div><fieldset><legend className="field-label mb-3">Make yourself comfortable</legend><div className="grid grid-cols-2 gap-2">{amenityOptions.map(option => <label className="checkbox-tile" key={option.id}><input type="checkbox" checked={filters.includes(option.id)} onChange={() => toggleFilter(option.id)}/><Icon name={option.icon}/>{option.label}</label>)}</div></fieldset><label className="field-label mt-6 block" htmlFor="price-filter">Price range</label><select id="price-filter" className="form-input mt-2" value={price} onChange={event => setPrice(event.target.value)}><option value="all">Any price</option><option value="1">$ · Easy on the wallet</option><option value="2">$$ · A little treat</option><option value="3">$$$ · Something special</option></select><div className="flex justify-between mt-8"><button className="button button-soft" onClick={resetFilters}>Reset filters</button><button className="button button-accent" onClick={() => dialog.current?.close()}>Show {filtered.length} places<Icon name="arrow" size={16}/></button></div></Dialog>
  </>;
}
