'use client';

import Image from 'next/image';
import Link from 'next/link';
import { amenityOptions, type Shop } from '@/lib/coffee-data';
import { Icon } from './icon';
import { useJournal } from './journal-provider';

export function BookmarkButton({ shop, showLabel = false }: { shop: Shop; showLabel?: boolean }) {
  const { saved, toggleSaved } = useJournal();
  const isSaved = saved.includes(shop.id);
  return <button type="button" className={showLabel ? 'button button-soft' : 'bookmark-button'} aria-label={`${isSaved ? 'Unsave' : 'Save'} ${shop.name}`} aria-pressed={isSaved} onClick={() => toggleSaved(shop.id)}>
    <Icon name="bookmark" size={17} fill={isSaved}/>{showLabel && (isSaved ? 'Saved to list' : 'Save to list')}
  </button>;
}

export function AmenityTags({ shop, limit = 3 }: { shop: Shop; limit?: number }) {
  return <div className="amenity-tags">{shop.amenities.slice(0, limit).map(id => {
    const option = amenityOptions.find(item => item.id === id)!;
    const label = id === 'wifi' ? `${shop.wifi} Mbps` : id === 'outlets' ? shop.outlets : option.label;
    return <span key={id}><Icon name={option.icon} size={13}/>{label}</span>;
  })}</div>;
}

export function ShopCard({ shop, featured = false, grid = false }: { shop: Shop; featured?: boolean; grid?: boolean }) {
  return <article className={`shop-card group ${grid ? 'shop-card-grid' : ''}`}>
    <div className="shop-card-image">
      <Link href={`/shops/${shop.id}`} tabIndex={-1} aria-hidden="true"><Image src={shop.image} alt="" fill sizes={grid ? '(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw' : '(max-width: 639px) 92vw, 220px'} preload={featured} className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"/></Link>
      <span className="image-category">{shop.category}</span>
      <BookmarkButton shop={shop}/>
    </div>
    <div className="shop-card-content">
      <div className="flex items-center justify-between gap-2"><span className="eyebrow text-muted">{shop.neighborhood}</span><span className="rating"><Icon name="star" size={14} fill/><strong>{shop.rating.toFixed(1)}</strong><span className="rating-count">({shop.reviews})</span></span></div>
      <h2><Link href={`/shops/${shop.id}`}>{shop.name}</Link></h2>
      <p className="shop-description">{shop.description}</p>
      <AmenityTags shop={shop}/>
      <div className="shop-card-meta"><span className="flex items-center gap-1.5"><span className="status-dot"/>{shop.noise}</span><span>{'$'.repeat(shop.price)}<span className="mx-2 opacity-40">·</span>{shop.distance} mi away</span></div>
    </div>
  </article>;
}
