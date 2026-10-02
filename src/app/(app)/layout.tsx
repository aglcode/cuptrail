import { AppFooter, AppHeader } from "@/components/layout/app-shell";
import { JournalProvider } from "@/components/providers/journal-provider";

// Chrome for the product itself (Discover, My shops, Log visit). The landing page
// in (marketing)/ has its own; fonts, Clerk, and globals live in the root layout.
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <JournalProvider>
      <AppHeader />
      {children}
      <AppFooter />
    </JournalProvider>
  );
}
