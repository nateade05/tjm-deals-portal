'use client';

import type { HTMLAttributes, PropsWithChildren } from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    padded?: boolean;
  }
>;

export function Card({ className, children, padded = true, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-subtle bg-surface text-primary shadow-sm transition-shadow duration-200',
        padded && 'p-4',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
