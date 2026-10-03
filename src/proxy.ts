import { clerkMiddleware } from "@clerk/nextjs/server";

// Next.js 16 only detects the proxy when it sits beside `app/` (here: src/).
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp)).*)",
    "/(api|trpc)(.*)",
  ],
};
