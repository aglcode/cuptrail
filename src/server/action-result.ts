import { z } from "zod";

/**
 * What every server action returns. Expected failures (signed out, invalid input,
 * missing record) come back as values the UI can render; anything else throws
 * and is handled by the nearest error boundary.
 */
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail(error: string, fieldErrors?: Record<string, string[] | undefined>): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}

export function invalid(error: z.ZodError): ActionResult<never> {
  return fail("Some fields need another look.", z.flattenError(error).fieldErrors);
}

export const SIGNED_OUT = "Sign in to save this to your journal.";
