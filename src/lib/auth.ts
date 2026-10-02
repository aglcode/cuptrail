import "server-only";
import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * The app's `User` row for the signed-in Clerk user, or `null` when signed out.
 *
 * Clerk owns identity; the `User` table mirrors it just-in-time so app data can
 * reference `User.id` (= Clerk's user ID). The hot path is one primary-key lookup:
 * `auth()` reads the session token locally, and Clerk's rate-limited Backend API
 * (`currentUser()`) is only called the first time a user is seen.
 *
 * Memoized per request, so any number of server components can call it.
 */
export const getUser = cache(async (): Promise<User | null> => {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Upsert, not create: two first requests can race to insert the same user.
  return prisma.user.upsert({
    where: { id: clerkUser.id },
    update: {},
    create: {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
      name: clerkUser.fullName ?? null,
      image: clerkUser.imageUrl ?? null,
    },
  });
});

export class UnauthorizedError extends Error {
  constructor() {
    super("You need to be signed in to do that.");
    this.name = "UnauthorizedError";
  }
}

/** Like `getUser`, but throws `UnauthorizedError` when signed out. For mutations. */
export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
