/**
 * Build `/listings` URLs with consistent query params (category tab + pricing segment + sort).
 */
export function buildListingsHref(opts: {
  categoryTab: string | null;
  pricingCategory: string;
  sort?: string;
}): string {
  const sp = new URLSearchParams();
  if (opts.categoryTab === 'in_stock' || opts.categoryTab === 'opportunity') {
    sp.set('category', opts.categoryTab);
  }
  if (opts.pricingCategory && opts.pricingCategory !== 'all') {
    sp.set('pricingCategory', opts.pricingCategory);
  }
  if (opts.sort && opts.sort !== 'newest') {
    sp.set('sort', opts.sort);
  }
  const q = sp.toString();
  return q ? `/listings?${q}` : '/listings';
}
