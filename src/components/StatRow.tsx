interface StatRowProps {
  label: string;
  value: React.ReactNode;
}

export function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-zinc-100 py-3 last:border-0">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-zinc-900">{value}</span>
    </div>
  );
}
