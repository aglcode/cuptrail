import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="app-footer">
      <div className="page-width flex flex-wrap items-center justify-between gap-5 py-8">
        <div className="flex items-center gap-3">
          <span className="brand-name text-xl">Cuptrail.</span>
          <span className="text-sm text-muted-foreground">
            Good coffee. Places worth keeping.
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <Link href="/shops">Discover shops</Link>
          <Link href="/me">Your journal</Link>
          <span>© 2026 Cuptrail</span>
        </div>
      </div>
    </footer>
  );
}
