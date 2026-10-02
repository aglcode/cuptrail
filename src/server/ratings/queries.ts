import "server-only";
import { prisma } from "@/lib/prisma";

/** The signed-in user's own rating of a shop (one per user per shop), if any. */
export async function getUserRating(userId: string, shopId: string) {
  return prisma.rating.findUnique({
    where: { userId_shopId: { userId, shopId } },
    select: { stars: true, comment: true, visibility: true, updatedAt: true },
  });
}
