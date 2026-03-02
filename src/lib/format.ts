const GBP_FORMATTER = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 0,
});

export function formatGBP(value: number | null | undefined): string {
  if (value == null) return '—';
  return GBP_FORMATTER.format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '—';
  return NUMBER_FORMATTER.format(value);
}

export function formatMiles(value: number | null | undefined): string {
  if (value == null) return '—';
  return `${formatNumber(value)} mi`;
}

export function timeAgo(dateIso: string): string {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return '—';

  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffMs = startOfToday.getTime() - startOfDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;

  const months = Math.floor(diffDays / 30);
  if (months < 12) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

/** Strip non-digits from string (for normalizing numeric input). */
export function stripNonDigits(s: string): string {
  return s.replace(/\D/g, '');
}

/** Format a raw digit string for GBP display (e.g. "49000" -> "£49,000"). */
export function formatGBPNumberString(rawDigits: string): string {
  const digits = stripNonDigits(rawDigits);
  if (!digits) return '';
  const n = parseInt(digits, 10);
  if (Number.isNaN(n)) return '';
  return GBP_FORMATTER.format(n);
}

/** Format a raw digit string for miles display (e.g. "49000" -> "49,000 mi"). */
export function formatMilesNumberString(rawDigits: string): string {
  const digits = stripNonDigits(rawDigits);
  if (!digits) return '';
  const n = parseInt(digits, 10);
  if (Number.isNaN(n)) return '';
  return `${NUMBER_FORMATTER.format(n)} mi`;
}

