// Set NEXT_PUBLIC_EARLY_ACCESS=true (Vercel: Production only) to replace sign-in
// with the early-access request. Inlined at build time, so changing it needs a redeploy.
export const EARLY_ACCESS_ONLY =
  process.env.NEXT_PUBLIC_EARLY_ACCESS === "true";
