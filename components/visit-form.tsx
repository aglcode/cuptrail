'use client';

import { Toggle } from './ui/toggle';

import { LinkButton } from './ui/link-button';
import { NativeSelect } from './ui/native-select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

import { useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { shops, getShop, amenityOptions, type Shop, type VisitDraft, type Amenity } from '@/lib/coffee-data';
import { Icon } from './icon';
import { useJournal } from './journal-provider';

const subscribe = () => () => {};
export function VisitForm({ shop }: { shop: Shop }) {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  return <main id="main-content" className="page-width log-main">{ready ? <VisitFormContent initialShop={shop}/> : <div className="form-loading" role="status"><Icon name="coffee" size={30}/><h1>Log a visit</h1><p>Getting your journal ready…</p></div>}</main>;
}

function localDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}
function blankDraft(shop: Shop): VisitDraft { return { shopId: shop.id, date: localDate(), stars: 0, duration: 1.5, note: '', amenities: [], orders: [], photos: [] }; }
const orders = ['Pour-over', 'Flat white', 'Cortado', 'Cold brew', 'Matcha', 'Cardamom bun'];

function VisitFormContent({ initialShop }: { initialShop: Shop }) {
  const { drafts, visits, saveDraft, discardDraft, saveVisit, notify } = useJournal();
  const [draft, setDraft] = useState<VisitDraft>(drafts[initialShop.id] ?? blankDraft(initialShop));
  const [status, setStatus] = useState(drafts[initialShop.id] ? 'Draft restored' : 'No draft yet');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customOrder, setCustomOrder] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const ratingRef = useRef<HTMLInputElement>(null);
  const draftRef = useRef(draft);
  const router = useRouter();
  const shop = getShop(draft.shopId)!;
  const personalVisits = visits.filter(visit => !visit.example);
  function update(next: Partial<VisitDraft>) {
    const value = { ...draftRef.current, ...next };
    draftRef.current = value;
    setDraft(value);
    setError('');
    setStatus(saveDraft(value) ? 'Draft saved on this device' : 'Draft not saved — browser storage is full');
  }
  function toggleAmenity(id: Amenity) { update({ amenities: draft.amenities.includes(id) ? draft.amenities.filter(item => item !== id) : [...draft.amenities, id] }); }
  function toggleOrder(order: string) { update({ orders: draft.orders.includes(order) ? draft.orders.filter(item => item !== order) : [...draft.orders, order] }); }
  function changeShop(id: string) {
    const next = drafts[id] ?? blankDraft(getShop(id)!);
    setDraft(next); draftRef.current = next; setError(''); setStatus(drafts[id] ? 'Draft restored' : 'No draft yet');
  }
  async function attachPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length + draftRef.current.photos.length > 4) { setError('You can keep up to four photos with each visit.'); return; }
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024)) { setError('Choose JPG, PNG, or WebP photos smaller than 10 MB.'); return; }
    setUploading(true); setError('');
    try {
      const photos = await Promise.all(files.map(resizePhoto));
      update({ photos: [...draftRef.current.photos, ...photos] });
    } catch { setError('One of those photos could not be opened. Try another image.'); }
    finally { setUploading(false); }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    if (!draft.stars) { setError('Choose a star rating to remember how your visit felt.'); ratingRef.current?.focus(); return; }
    const date = new Date(draft.date);
    if (!draft.date || Number.isNaN(date.getTime()) || date.getTime() > Date.now() + 60_000) { setError('Choose a visit time in the past or today.'); return; }
    setSaving(true);
    if (saveVisit(draft)) router.push('/my-shops');
    else { setError('Your visit could not be saved. Your draft is still here.'); setSaving(false); }
  }
  function discard() { discardDraft(shop.id); notify('Draft discarded.'); router.push(`/shops/${shop.id}`); }
  return <form onSubmit={submit} className="visit-form">
    <div className="form-header"><div><p className="eyebrow text-primary mb-2">A little note from your coffee trail</p><h1>Log a visit</h1><p className="flex items-center gap-2 mt-2 text-muted-foreground"><Icon name="coffee" size={17}/>{shop.name}<span className="opacity-40">·</span>{shop.neighborhood}</p></div><LinkButton variant="secondary" href={`/shops/${shop.id}`} className="icon-button" aria-label="Close visit form"><Icon name="close" size={20}/></LinkButton></div>
    <div className="form-context"><label htmlFor="shop-select" className="field-label">Where did you stop?</label><NativeSelect id="shop-select" className="form-input w-full" disabled={uploading} value={draft.shopId} onChange={event => changeShop(event.target.value)}>{shops.map(item => <option key={item.id} value={item.id}>{item.name} · {item.neighborhood}</option>)}</NativeSelect><span className="draft-status" role="status"><Icon name="check" size={13}/>{status}</span></div>
    <div className="form-columns"><div className="flex flex-col gap-7">
      <fieldset className="rating-field" role="radiogroup" aria-required="true" aria-invalid={Boolean(error && !draft.stars)} aria-describedby={error ? "rating-hint visit-error" : "rating-hint"}><legend className="field-label">Overall impression (required) <span className="text-primary">{draft.stars ? `${draft.stars}.0 / 5.0` : 'Choose your rating'}</span></legend><div className="star-picker">{[1, 2, 3, 4, 5].map(star => <label key={star}><input ref={star === 1 ? ratingRef : undefined} type="radio" name="stars" value={star} checked={draft.stars === star} onChange={() => update({ stars: star })} aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}/><Icon name="star" size={34} fill={draft.stars >= star} className={draft.stars >= star ? 'text-primary' : 'text-muted-foreground'}/></label>)}</div><p id="rating-hint" className="rating-caption">{['How did this little corner make you feel?', 'Not quite my cup of coffee.', 'A few good moments.', 'A lovely little coffee stop.', 'A place I’ll come back to.', 'A new favorite. Keep this one.'][draft.stars]}</p></fieldset>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="form-time"><label className="field-label" htmlFor="visit-date"><Icon name="calendar" size={15}/>Visit time (required)</label><Input required type="datetime-local" id="visit-date" className="form-input" value={draft.date} max={localDate()} onChange={event => update({ date: event.target.value })}/></div><div className="form-time"><label className="field-label flex justify-between" htmlFor="duration">Time spent<span>{draft.duration} {draft.duration === 1 ? 'hour' : 'hours'}</span></label><input type="range" min="0.5" max="6" step="0.5" id="duration" value={draft.duration} onChange={event => update({ duration: Number(event.target.value) })}/><div className="flex justify-between text-xs text-muted-foreground"><span>30 min</span><span>A slow afternoon</span><span>6h</span></div></div></div>
      <fieldset><legend className="field-label w-full flex flex-wrap gap-2 justify-between mb-3">What made it comfortable?<span className="font-normal normal-case tracking-normal text-muted-foreground">{draft.amenities.length} selected</span></legend><div className="amenity-picker">{amenityOptions.map(option => <label key={option.id} className={`checkbox-tile ${draft.amenities.includes(option.id) ? 'selected' : ''}`}><Checkbox aria-label={option.label} checked={draft.amenities.includes(option.id)} onCheckedChange={() => toggleAmenity(option.id)}/><Icon name={option.icon} size={17}/>{option.label}</label>)}</div></fieldset>
      <fieldset><legend className="field-label mb-3">What did you order? <span className="field-optional">Optional</span></legend><div className="order-picker">{Array.from(new Set([...orders, ...draft.orders])).map(order => <Toggle variant="outline" type="button" key={order} className={`filter-chip`} pressed={draft.orders.includes(order)} onPressedChange={() => toggleOrder(order)}>{order}<Icon name={draft.orders.includes(order) ? 'check' : 'plus'} size={13}/></Toggle>)}<Button variant="outline" className="filter-chip" type="button" onClick={() => setShowCustom(value => !value)} aria-expanded={showCustom}><Icon name="plus" size={13}/>Something else</Button></div>{showCustom && <div className="custom-order"><Input aria-label="Custom order item" className="form-input" value={customOrder} maxLength={50} onChange={event => setCustomOrder(event.target.value)} placeholder="Your order…"/><Button variant="secondary" type="button" className="button button-soft" disabled={!customOrder.trim()} onClick={() => { const item = customOrder.trim(); if (!draft.orders.includes(item)) update({ orders: [...draft.orders, item] }); setCustomOrder(''); setShowCustom(false); }}>Add</Button></div>}</fieldset>
    </div><div className="flex flex-col gap-7"><div><div className="field-label flex items-center justify-between mb-3"><label htmlFor="visit-notes">Your notes & little details</label><span className="font-normal text-muted-foreground">{draft.note.length} / 500</span></div><Textarea id="visit-notes" className="form-notes resize-y min-h-[210px] text-base" rows={7} maxLength={500} placeholder="The coffee, your favorite seat, the music… What would you like to remember?" value={draft.note} onChange={event => update({ note: event.target.value })}/><p className="privacy-note"><Icon name="lock" size={13}/>Just for you. Your notes stay on this device.</p></div>
      <div><div className="field-label flex justify-between mb-3"><span>Photos of the moment</span><span className="font-normal text-muted-foreground">{draft.photos.length} / 4</span></div><div className="photo-upload-grid">{draft.photos.map((src, index) => <div className="uploaded-photo" key={src.slice(-30) + index}><Image src={src} alt={`Visit photo ${index + 1}`} fill sizes="150px" unoptimized className="object-cover"/><Button variant="ghost" type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => update({ photos: draft.photos.filter((_, photoIndex) => index !== photoIndex) })}><Icon name="close" size={14}/></Button></div>)}{draft.photos.length < 4 && <label className="photo-upload"><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={attachPhotos}/><Icon name="camera" size={23}/><span>{uploading ? 'Preparing photos…' : 'Add a photo'}</span></label>}</div><p className="privacy-note">JPG, PNG, WebP · 10 MB each · stored in this browser</p></div>
      <div className="milestone-card"><span className="milestone-icon"><Icon name="book" size={23}/></span><div><p className="eyebrow text-primary">Your private journal</p><h2>{personalVisits.length ? `Your ${personalVisits.length + 1}${ordinalSuffix(personalVisits.length + 1)} coffee memory` : 'The start of your coffee trail'}</h2><p>Keep the details you would like to remember for next time.</p></div></div>
    </div></div>
    {error && <p id="visit-error" role="alert" className="form-error">{error}</p>}
    <div className="form-actions"><span className="privacy-note"><Icon name="lock" size={14}/>A private journal, saved on this device.</span><div className="flex items-center gap-3"><Button variant="secondary" type="button" className="button button-soft" onClick={discard}>Discard</Button><Button variant="default" disabled={saving || uploading} type="submit" className="button button-accent"><Icon name="bookmark" size={17}/>{saving ? 'Saving your visit…' : 'Save visit & rating'}</Button></div></div>
  </form>;
}

function ordinalSuffix(value: number) { return value % 100 >= 11 && value % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] ?? 'th'); }
async function resizePhoto(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = new window.Image();
    img.src = url; await img.decode();
    const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.75);
  } finally { URL.revokeObjectURL(url); }
}
