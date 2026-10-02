import { z } from "zod";

export const rateShopSchema = z.object({
  shopId: z.string().min(1).max(64),
  stars: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional(),
  visibility: z.enum(["PRIVATE", "FRIENDS", "PUBLIC"]).optional(),
});
export type RateShopInput = z.input<typeof rateShopSchema>;

export const shopIdSchema = z.string().min(1).max(64);
