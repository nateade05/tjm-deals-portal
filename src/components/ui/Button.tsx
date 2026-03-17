'use client';

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type Variant = 'primary' | 'outline' | 'ghost' | 'gold' | 'whatsapp';
type Size = 'sm' | 'md';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
  }
>;

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<Variant, string> = {
    primary:
      'bg-ink text-surface hover:bg-primary focus-visible:ring-ink',
    outline:
      'border border-border-strong bg-surface text-primary hover:bg-surface-alt focus-visible:ring-border-strong',
    ghost:
      'text-primary hover:bg-surface-alt focus-visible:ring-border-subtle',
    gold:
      'bg-gold text-surface hover:bg-gold-hover focus-visible:ring-gold',
    whatsapp:
      'bg-[#25D366] text-white hover:bg-[#20bd5a] focus-visible:ring-[#25D366]',
  };

  const sizes: Record<Size, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        'whitespace-nowrap',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
