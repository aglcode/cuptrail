'use client';

import { useEffect, useState } from 'react';
import type { ShopView } from '@/types';

type Lookup = { key: string; shops: Map<string, ShopView>; failed: boolean };
const empty = new Map<string, ShopView>();

/**
 * Resolves shop slugs referenced by the device-local journal via /api/shops/lookup.
 * Keeps the previous result while a new set loads, so removing a visit doesn't
 * flash a loading state. `loading` is only true before the first response.
 */
export function useShopLookup(slugs: string[]) {
  // The API caps a lookup at 100 slugs; the journal moves server-side before that matters.
  const key = [...new Set(slugs)].sort().join(',');
  const [lookup, setLookup] = useState<Lookup | null>(null);

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    fetch(`/api/shops/lookup?slugs=${encodeURIComponent(key)}`, { signal: controller.signal })
      .then(response => response.ok ? response.json() as Promise<ShopView[]> : Promise.reject(new Error(String(response.status))))
      .then(shops => setLookup({ key, shops: new Map(shops.map(shop => [shop.slug, shop])), failed: false }))
      .catch(() => { if (!controller.signal.aborted) setLookup(current => ({ key, shops: current?.shops ?? empty, failed: true })); });
    return () => controller.abort();
  }, [key]);

  return {
    shops: lookup?.shops ?? empty,
    loading: Boolean(key) && lookup === null,
    failed: lookup?.key === key && lookup.failed,
  };
}
