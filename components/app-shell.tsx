'use client';

import { LinkButton } from './ui/link-button';
import { Button } from './ui/button';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Show, SignInButton, UserButton } from '@clerk/nextjs';
import { Icon } from './icon';
import mascot from '@/public/brand/cuptrail-mascot.png';

export function AppHeader() {
  const path = usePathname();
  const isLibrary = path === '/my-shops';
  return <>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <header className="app-header">
      <div className="page-width flex items-center justify-between gap-4">
        <Link href="/" className="brand" aria-label="Cuptrail home">
          <Image src={mascot} alt="" width={44} height={44} sizes="44px" preload/>
          <div><span className="brand-name">Cuptrail<span className="brand-period">.</span></span><span className="brand-caption">Find a spot. Stay a while.</span></div>
        </Link>
        <span className="header-location"><Icon name="pin" size={15}/><span>New York chapter</span><span className="sample-dot"/></span>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/" aria-current={!isLibrary && path !== '/log-visit' ? 'page' : undefined}>Discover</Link>
          <Link href="/my-shops" aria-current={isLibrary ? 'page' : undefined}>My shops</Link>
        </nav>
        <div className="flex items-center gap-4">
          <LinkButton variant="default" href="/log-visit" className="button button-dark header-log hidden md:inline-flex"><Icon name="plus" size={16}/>Log visit</LinkButton>
          <Show when="signed-out"><SignInButton mode="modal"><Button variant="secondary" className="profile-button" aria-label="Sign in to Cuptrail"><Icon name="user" size={17}/></Button></SignInButton></Show>
          <Show when="signed-in"><UserButton appearance={{ elements: { avatarBox: 'w-11 h-11' } }}/></Show>
        </div>
      </div>
    </header>
    {path !== '/log-visit' && <nav className="mobile-nav" aria-label="Mobile navigation">
      <Link href="/" aria-current={!isLibrary && path !== '/log-visit' ? 'page' : undefined}><Icon name="compass" size={22}/><span>Discover</span></Link>
      <Link href="/log-visit" className="mobile-log" aria-label="Log a visit" aria-current={path === '/log-visit' ? 'page' : undefined}><span><Icon name="plus" size={24}/></span><span>Log visit</span></Link>
      <Link href="/my-shops" aria-current={isLibrary ? 'page' : undefined}><Icon name="book" size={22}/><span>My shops</span></Link>
    </nav>}
  </>;
}

export function AppFooter() {
  return <footer className="app-footer"><div className="page-width flex flex-wrap items-center justify-between gap-5 py-8">
    <div className="flex items-center gap-3"><span className="brand-name text-xl">Cuptrail.</span><span className="text-sm text-muted-foreground">Good coffee. Places worth keeping.</span></div>
    <div className="flex items-center gap-5 text-xs text-muted-foreground"><Link href="/">The directory</Link><Link href="/my-shops">Your field notes</Link><span>Stitch sample directory · © 2026</span></div>
  </div></footer>;
}
