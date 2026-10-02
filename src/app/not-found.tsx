import { AppFooter, AppHeader } from "@/components/layout/app-shell";
import { NotFoundContent } from "@/components/layout/not-found-content";

// Unmatched URLs render inside the root layout only, so bring the app chrome along.
export default function NotFound() {
  return (
    <>
      <AppHeader />
      <NotFoundContent />
      <AppFooter />
    </>
  );
}
