interface StatRowProps {
  label: string;
  value: React.ReactNode;
}

export function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-border-subtle py-3 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-primary">{value}</span>
    </div>
  );
}
