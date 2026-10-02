/** Shop slugs: lowercase letters, digits, and hyphens, e.g. "kona-and-clay". */
export const SHOP_SLUG_PATTERN = /^[a-z0-9-]{1,100}$/;

export function isShopSlug(value: unknown): value is string {
  return typeof value === "string" && SHOP_SLUG_PATTERN.test(value);
}
