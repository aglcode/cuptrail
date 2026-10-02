'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import mascot from '@/public/brand/cuptrail-mascot.png';
import { shops, getShop, formatVisitDate, type Visit } from '@/lib/coffee-data';
import { useJournal } from './journal-provider';
import { Icon } from './icon';
import { ShopCard } from './shop-card';

export function MyShops() {
  const { visits, saved, startJournal, showExamples, notify } = useJournal();
  const [tab, setTab] = useState<'all' | 'favorites' | 'work' | 'saved'>('all');
  const [sort, setSort] = useState('recent');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const isExample = visits.some(visit => visit.example);
  const uniqueShops = new Set(visits.map(visit => visit.shopId)).size;
  const average = visits.length ? (visits.reduce((sum, visit) => sum + visit.stars, 0) / visits.length).toFixed(1) : '—';
  const hours = visits.reduce((sum, visit) => sum + visit.duration, 0);
  const filtered = visits.filter(visit => {
    const shop = getShop(visit.shopId);
    return shop && (tab !== 'favorites' || visit.stars === 5) && (tab !== 'work' || visit.amenities.includes('wifi')) && `${shop.name} ${shop.neighborhood} ${visit.note}`.toLowerCase().includes(query.toLowerCase());
  }).sort((a, b) => sort === 'rating' ? b.stars - a.stars : sort === 'frequent' ? visits.filter(visit => visit.shopId === b.shopId).length - visits.filter(visit => visit.shopId === a.shopId).length : new Date(b.date).getTime() - new Date(a.date).getTime());
  const savedShops = shops.filter(shop => saved.includes(shop.id) && `${shop.name} ${shop.neighborhood}`.toLowerCase().includes(query.toLowerCase()));
  function exportJournal() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), visits, savedShops: shops.filter(shop => saved.includes(shop.id)) }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'cuptrail-journal.json'; anchor.click(); URL.revokeObjectURL(url);
    notify('Your journal export is ready.');
  }

  return <main id="main-content" className="page-width journal-main">
    <div className="journal-heading"><div><p className="eyebrow text-accent mb-2">Your personal coffee trail</p><h1>My shops</h1><p className="journal-description">Your visits, favorite corners, and places to try next.</p></div><div className="flex flex-wrap gap-2"><button className="button button-white" onClick={exportJournal}><Icon name="download" size={16}/>Export journal</button><Link href="/log-visit" className="button button-dark"><Icon name="plus" size={17}/>Log new visit</Link></div></div>
    <div className="journal-info"><span className="flex items-center gap-2"><Icon name={isExample ? 'book' : 'lock'} size={15}/>{isExample ? 'A peek at your future journal · example entries' : 'Your journal is private and saved on this device.'}</span>{isExample && <button onClick={startJournal}>Start my own journal<Icon name="arrow" size={14}/></button>}</div>
    <div className="journal-stats">{[
      { label: 'Shops explored', value: uniqueShops, detail: 'Little places, good memories', icon: 'coffee' as const },
      { label: 'Average rating', value: average, detail: 'Your personal taste', icon: 'star' as const },
      { label: 'Visits logged', value: visits.length, detail: 'Every stop has a story', icon: 'book' as const },
      { label: 'Time well spent', value: `${hours}h`, detail: 'A little slower, a little better', icon: 'clock' as const },
    ].map(stat => <div key={stat.label}><span className="eyebrow flex items-center justify-between">{stat.label}<Icon name={stat.icon} size={16} className="text-accent"/></span><strong>{stat.value}</strong><span className="stat-description">{stat.detail}</span></div>)}</div>
    <div className="journal-controls"><label className="journal-search"><Icon name="search" size={17}/><span className="journal-search-label"><span className="eyebrow">Search your journal</span><input type="search" aria-label="Search your journal" placeholder="Shop name or notes…" value={query} onChange={event => setQuery(event.target.value)}/></span></label><div className="flex items-center gap-3"><label className="sort-control"><span>Sort:</span><select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort journal"><option value="recent">Recently visited</option><option value="rating">Highest rated</option><option value="frequent">Most frequent</option></select></label><div className="view-toggle journal-layout-toggle"><button onClick={() => setLayout('grid')} aria-label="Grid layout" aria-pressed={layout === 'grid'}><Icon name="grid" size={16}/></button><button onClick={() => setLayout('list')} aria-label="List layout" aria-pressed={layout === 'list'}><Icon name="list" size={16}/></button></div></div></div>
    <div className="journal-tabs" aria-label="Journal filters">{([{ id: 'all', label: 'All visits', count: visits.length }, { id: 'favorites', label: 'Favorites', count: visits.filter(visit => visit.stars === 5).length }, { id: 'work', label: 'Work-friendly', count: visits.filter(visit => visit.amenities.includes('wifi')).length }, { id: 'saved', label: 'Saved for later', count: saved.length }] as const).map(item => <button key={item.id} className={`filter-chip ${tab === item.id ? 'active' : ''}`} aria-pressed={tab === item.id} onClick={() => setTab(item.id)}>{item.id === 'saved' && <Icon name="bookmark" size={13}/>} {item.label}<span>{item.count}</span></button>)}</div>
    {tab === 'saved' ? <div className="saved-grid">{savedShops.map(shop => <ShopCard key={shop.id} shop={shop} grid/>)}</div> : <div className={`journal-grid ${layout === 'list' ? 'journal-list' : ''}`}>{filtered.map(visit => <VisitCard key={visit.id} visit={visit} count={visits.filter(item => item.shopId === visit.shopId).length}/>)}{filtered.length > 0 && <Link href="/log-visit" className="new-visit-card"><span><Icon name="plus" size={26}/></span><h2>Another coffee, another chapter.</h2><p>Keep a little note from your next discovery.</p><span className="eyebrow text-accent">Log a new visit <Icon name="arrow" size={14}/></span></Link>}</div>}
    {(tab === 'saved' ? savedShops.length === 0 : filtered.length === 0) && <div className="empty-state"><Image src={mascot} alt="" width={128} height={128} sizes="128px" className="empty-mascot"/><h2>{query ? 'No matches in your journal.' : tab === 'saved' ? 'No saved shops yet.' : tab === 'favorites' ? 'No five-star visits yet.' : tab === 'work' ? 'No work-friendly visits yet.' : 'Your first visit starts here.'}</h2><p>{query ? 'Try a different search or filter.' : tab === 'saved' ? 'Tap the bookmark on a shop to keep it for another day.' : tab === 'favorites' ? 'Visits you rate five stars will appear here.' : tab === 'work' ? 'Visits you log with Wi-Fi will appear here.' : 'Discover a spot you love, then log your first visit.'}</p><Link href="/" className="button button-dark">Discover coffee shops<Icon name="arrow" size={16}/></Link></div>}
    {visits.length === 0 && tab !== 'saved' && <div className="flex justify-center"><button className="text-link" onClick={showExamples}>Take a peek at an example journal<Icon name="book" size={15}/></button></div>}
    <div className="journal-bottom-note"><Icon name="lock" size={14}/><span>{isExample ? 'Example notes are replaced when you save your first visit.' : 'Your notes and photos stay in this browser. Export your journal to keep a copy.'}</span></div>
  </main>;
}

function VisitCard({ visit, count }: { visit: Visit; count: number }) {
  const shop = getShop(visit.shopId)!;
  const { removeVisit } = useJournal();
  return <article className="visit-card group">
    <div className="visit-card-image">
      <Link href={`/shops/${shop.id}`} className="absolute inset-0" tabIndex={-1} aria-hidden="true">
        <Image src={visit.photos[0] ?? shop.journalImage} alt="" fill sizes="(max-width: 639px) 100px, (max-width: 1023px) 45vw, 30vw" unoptimized={Boolean(visit.photos[0])} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"/>
      </Link>
      <span className="visit-date">{formatVisitDate(visit.date)}</span>
      <span className="visit-rating" aria-label={`Rated ${visit.stars} out of 5`}><Icon name="star" fill size={13}/>{visit.stars}.0</span>
    </div>
    <div className="visit-card-content">
      <div className="flex items-center justify-between gap-2"><span className="eyebrow text-accent">{shop.neighborhood}</span><span className="text-[11px] text-muted">{count} {count === 1 ? 'visit' : 'visits'}</span></div>
      <h2><Link href={`/shops/${shop.id}`}>{shop.name}</Link></h2>
      <p className="visit-note">{visit.note ? `“${visit.note}”` : 'A coffee stop worth remembering.'}</p>
      <div className="visit-atmosphere"><span className="eyebrow">Atmosphere</span><span><span className="status-dot"/>{shop.noise}</span></div>
      <div className="amenity-tags">{visit.orders.slice(0, 2).map(order => <span key={order}>{order}</span>)}<span><Icon name="clock" size={12}/>{visit.duration}h</span></div>
      {!visit.example && <button className="visit-delete" aria-label={`Remove visit to ${shop.name} on ${formatVisitDate(visit.date)}`} onClick={() => removeVisit(visit.id)}><Icon name="close" size={12}/>Remove visit</button>}
    </div>
  </article>;
}
