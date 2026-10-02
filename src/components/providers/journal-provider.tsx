'use client';

import { createContext, useContext, useSyncExternalStore, useState, type ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { exampleVisits } from './example-journal';
import { isShopSlug } from '@/lib/slug';
import { amenityOptions } from '@/lib/amenities';
import type { Visit, VisitDraft } from '@/types';

type Journal = { visits: Visit[]; saved: string[]; drafts: Record<string, VisitDraft> };
const initial: Journal = { visits: exampleVisits, saved: [], drafts: {} };
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => { listeners.delete(listener); window.removeEventListener('storage', listener); };
}
function read(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
function parse(value: string | null): Journal {
  if (!value) return initial;
  try {
    const result = JSON.parse(value);
    if (!Array.isArray(result.visits) || !result.visits.every(validVisit) || !Array.isArray(result.saved) || !result.saved.every(isShopSlug) || typeof result.drafts !== 'object' || !result.drafts || Array.isArray(result.drafts) || !Object.values(result.drafts).every(validDraft)) return initial;
    return result;
  } catch { return initial; }
}
function validDraft(value: unknown): value is VisitDraft {
  if (!value || typeof value !== 'object') return false;
  const draft = value as VisitDraft;
  return isShopSlug(draft.shopId) && typeof draft.date === 'string' && !Number.isNaN(new Date(draft.date).getTime()) && Number.isInteger(draft.stars) && draft.stars >= 0 && draft.stars <= 5 && Number.isFinite(draft.duration) && draft.duration >= 0.5 && draft.duration <= 6 && typeof draft.note === 'string' && draft.note.length <= 500 && Array.isArray(draft.amenities) && draft.amenities.every(id => amenityOptions.some(option => option.id === id)) && Array.isArray(draft.orders) && draft.orders.every(order => typeof order === 'string') && Array.isArray(draft.photos) && draft.photos.length <= 4 && draft.photos.every(photo => typeof photo === 'string' && photo.startsWith('data:image/'));
}
function validVisit(value: unknown): value is Visit {
  return validDraft(value) && typeof (value as Visit).id === 'string' && value.stars >= 1;
}

type JournalContext = Journal & {
  toggleSaved: (id: string) => void;
  saveVisit: (draft: VisitDraft) => boolean;
  saveDraft: (draft: VisitDraft) => boolean;
  discardDraft: (id: string) => void;
  startJournal: () => void;
  showExamples: () => void;
  removeVisit: (id: string) => void;
  notify: (message: string) => void;
};
const Context = createContext<JournalContext | null>(null);

export function JournalProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const key = `cuptrail-journal-v1:${user?.id ?? 'guest'}`;
  const snapshot = useSyncExternalStore(subscribe, () => read(key), () => null);
  const journal = parse(snapshot);
  const [message, setMessage] = useState('');
  const [removedVisit, setRemovedVisit] = useState<Visit | null>(null);

  function notify(text: string) { setMessage(text); }
  function write(update: (current: Journal) => Journal, quiet = false) {
    try {
      const next = update(parse(read(key)));
      localStorage.setItem(key, JSON.stringify(next));
      listeners.forEach(listener => listener());
      return true;
    } catch {
      if (!quiet) notify('Your device could not save this. Free some browser storage or export your journal first.');
      return false;
    }
  }
  function toggleSaved(id: string) {
    const alreadySaved = journal.saved.includes(id);
    if (write(current => ({ ...current, saved: alreadySaved ? current.saved.filter(item => item !== id) : [...current.saved, id] }))) {
      notify(alreadySaved ? 'Shop removed from your saved list.' : 'Shop saved. Find it in My Shops.');
    }
  }
  function saveVisit(draft: VisitDraft) {
    const success = write(current => {
      const drafts = { ...current.drafts };
      delete drafts[draft.shopId];
      return { ...current, drafts, visits: [{ ...draft, id: crypto.randomUUID() }, ...current.visits.filter(visit => !visit.example)] };
    });
    if (success) notify('Visit & rating saved to your journal on this device.');
    return success;
  }
  function saveDraft(draft: VisitDraft) { return write(current => ({ ...current, drafts: { ...current.drafts, [draft.shopId]: draft } }), true); }
  function discardDraft(id: string) { write(current => { const drafts = { ...current.drafts }; delete drafts[id]; return { ...current, drafts }; }); }
  function startJournal() {
    if (write(current => ({ ...current, visits: current.visits.filter(visit => !visit.example) }))) notify('Your journal is ready for your first coffee stop.');
  }
  function showExamples() {
    write(current => current.visits.length ? current : { ...current, visits: exampleVisits });
  }
  function removeVisit(id: string) {
    const visit = journal.visits.find(item => item.id === id);
    if (visit && write(current => ({ ...current, visits: current.visits.filter(item => item.id !== id) }))) {
      setRemovedVisit(visit); notify('Visit removed from your journal.');
    }
  }
  function undoRemove() {
    if (removedVisit && write(current => ({ ...current, visits: [removedVisit, ...current.visits] }))) {
      setRemovedVisit(null); notify('Visit restored to your journal.');
    }
  }

  return <Context.Provider value={{ ...journal, toggleSaved, saveVisit, saveDraft, discardDraft, startJournal, showExamples, removeVisit, notify }}>
    {children}
    <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">
      {message && <div className="toast"><span>{message}</span>{removedVisit && message === 'Visit removed from your journal.' && <button className="toast-undo" onClick={undoRemove}>Undo</button>}<button onClick={() => setMessage('')} aria-label="Dismiss notification">×</button></div>}
    </div>
  </Context.Provider>;
}

export function useJournal() {
  const context = useContext(Context);
  if (!context) throw new Error('JournalProvider is required.');
  return context;
}
