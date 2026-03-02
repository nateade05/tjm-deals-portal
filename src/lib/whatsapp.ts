interface BuildWhatsAppUrlParams {
  phoneE164: string;
  text: string;
}

export function buildWhatsAppUrl({ phoneE164, text }: BuildWhatsAppUrlParams): string {
  const digits = phoneE164.replace(/\D/g, '');
  if (!digits) {
    throw new Error('Invalid phone number: no digits');
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

