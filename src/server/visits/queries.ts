import "server-only";
import { prisma } from "@/lib/prisma";

const MAX_PAGE_SIZE = 50;

/**
 * A user's journal, newest first, keyset-paginated on the
 * (userId, visitedAt desc) index: pass the last visit's id as `cursor`.
 */
export async function listVisitsForUser(
  userId: string,
  { cursor, limit = 20 }: { cursor?: string; limit?: number } = {},
) {
  const take = Math.min(Math.max(limit, 1), MAX_PAGE_SIZE);
  const visits = await prisma.visit.findMany({
    where: { userId },
    orderBy: [{ visitedAt: "desc" }, { id: "desc" }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      note: true,
      visitedAt: true,
      shop: {
        select: { id: true, slug: true, name: true, neighborhood: true },
      },
    },
  });
  const hasMore = visits.length > take;
  const items = hasMore ? visits.slice(0, take) : visits;
  return { items, nextCursor: hasMore ? items.at(-1)!.id : null };
}
