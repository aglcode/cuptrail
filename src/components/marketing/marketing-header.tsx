import Image from "next/image";
import Link from "next/link";
import { HeaderAccount } from "@/components/layout/header-account";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import mascot from "@public/brand/cuptrail-mascot.png";

export function MarketingHeader() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="app-header">
        <div className="page-width flex items-center justify-between gap-4">
          <Link href="/" className="brand" aria-label="Cuptrail home">
            <Image
              src={mascot}
              alt=""
              width={44}
              height={44}
              sizes="44px"
              preload
            />
            <div>
              <span className="brand-name">
                Cuptrail<span className="brand-period">.</span>
              </span>
              <span className="brand-caption">Find a spot. Stay a while.</span>
            </div>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/shops">Discover shops</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LinkButton
              variant="default"
              href="/shops"
              className="button button-accent"
            >
              Open the app
              <Icon name="arrow" size={16} />
            </LinkButton>
            <HeaderAccount />
          </div>
        </div>
      </header>
    </>
  );
}
