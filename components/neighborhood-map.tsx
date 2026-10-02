'use client';

import { Button } from './ui/button';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Shop } from '@/lib/coffee-data';
import { Icon } from './icon';

export function NeighborhoodMap({ shops, compact = false }: { shops: Shop[]; compact?: boolean }) {
  const [selected, setSelected] = useState<string>('kona-and-clay');
  const [zoom, setZoom] = useState(1);
  const current = shops.find(shop => shop.id === selected) ?? shops[0];
  return <section className={`neighborhood-map ${compact ? 'map-compact' : ''}`} aria-label="Sample neighborhood map">
    <div className="map-canvas">
      <div className="map-art" style={{ transform: `scale(${zoom})` }}>
        <Image src="/images/neighborhood-map.webp" alt="Illustrative map of New York from the Stitch design" fill sizes="(max-width: 1023px) 94vw, 440px" className="object-cover"/>
        {shops.map(shop => <Button variant="ghost" key={shop.id} className={`map-pin ${shop.id === current?.id ? 'selected' : ''}`} style={{ left: `${shop.map[0]}%`, top: `${shop.map[1]}%` }} onClick={() => setSelected(shop.id)} aria-label={`Show ${shop.name}, rated ${shop.rating}`} aria-pressed={shop.id === current?.id}>
          <Icon name="star" size={12} fill/><span>{shop.rating.toFixed(1)}</span><span className="map-pin-price">{'$'.repeat(shop.price)}</span>
        </Button>)}
      </div>
      <span className="map-label"><span className="status-dot"/>New York coffee trail</span>
      <div className="map-controls">
        <Button variant="ghost" aria-label="Zoom map in" disabled={zoom >= 1.8} onClick={() => setZoom(value => Math.min(1.8, value + 0.2))}><Icon name="plus"/></Button>
        <Button variant="ghost" aria-label="Zoom map out" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - 0.2))}><Icon name="minus"/></Button>
        <Button variant="ghost" aria-label="Reset map view" onClick={() => { setZoom(1); setSelected(shops[0]?.id ?? ''); }}><Icon name="reset" size={17}/></Button>
      </div>
      <span className="map-caption">Illustrative map · sample locations</span>
      {current && !compact && <Link className="map-shop-preview" href={`/shops/${current.id}`}>
        <Image src={current.image} alt="" width={64} height={64} className="rounded object-cover"/>
        <div className="min-w-0 flex-1"><span className="map-shop-name">{current.name}</span><p>{current.neighborhood} · {current.wifi ? `${current.wifi} Mbps Wi-Fi` : 'Unplug & unwind'}</p><span className="eyebrow text-primary">Explore this shop</span></div><Icon name="arrow"/>
      </Link>}
    </div>
    {!compact && <div className="map-ledger"><div><span className="eyebrow">Shops in this view</span><strong>{shops.length} places</strong></div><div><span className="eyebrow">The neighborhood</span><strong>New York</strong></div></div>}
  </section>;
}
