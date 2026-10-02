import { NotFoundContent } from "@/components/layout/not-found-content";

// notFound() from app routes (e.g. an unknown /shops/[slug]) renders inside
// (app)/layout.tsx, which already provides the header and footer.
export default function NotFound() {
  return <NotFoundContent />;
}
