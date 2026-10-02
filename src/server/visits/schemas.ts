import { z } from "zod";

// Allow a minute of clock skew between the visitor's device and the server.
const notInTheFuture = (date: Date) => date.getTime() <= Date.now() + 60_000;

export const logVisitSchema = z.object({
  shopId: z.string().min(1).max(64),
  visitedAt: z.coerce.date().refine(notInTheFuture, "Choose a visit time in the past or today."),
  note: z.string().trim().max(500).optional(),
});
export type LogVisitInput = z.input<typeof logVisitSchema>;

export const visitIdSchema = z.string().min(1).max(64);
