export default function Loading() {
  return <main id="main-content" className="page-width py-14" aria-busy="true"><p role="status" className="eyebrow text-primary">Finding your coffee corner…</p><div aria-hidden="true"><div className="loading-skeleton mt-6 h-12 w-2/3 rounded-2xl"/><div className="grid gap-5 mt-10">{[1, 2, 3].map(key => <div key={key} className="loading-skeleton h-56 rounded-3xl"/>)}</div></div></main>;
}
