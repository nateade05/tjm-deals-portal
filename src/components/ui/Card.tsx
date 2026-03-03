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
        'rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100',
        padded && 'p-4',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

