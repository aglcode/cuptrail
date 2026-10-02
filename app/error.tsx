'use client';
import { Icon } from '@/components/icon';
export default function ErrorPage({ retry }: { retry: () => void }) {
  return <main id="main-content" className="page-width empty-state min-h-[60vh]"><Icon name="coffee" size={40}/><h1>Something went wrong.</h1><p>This page could not load. Try again to pick up where you left off.</p><button className="button button-dark" onClick={retry}>Try again<Icon name="reset" size={16}/></button></main>;
}
