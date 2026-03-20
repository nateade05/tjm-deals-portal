interface StatRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function StatRow({ label, value, className = '' }: StatRowProps) {
  return (
    <div
      className={`flex justify-between gap-4 border-b border-border-subtle/70 py-2.5 last:border-0 sm:py-2.5 ${className}`}
    >
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-[13px] font-medium tabular-nums text-primary">{value}</span>
    </div>
  );
}
