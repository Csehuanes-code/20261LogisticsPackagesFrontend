interface CapacityBarProps {
  label: string;
  value: string;
  pct: number;
  color: string;
}

export function CapacityBar({ label, value, pct, color }: CapacityBarProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-bold text-foreground tabular-nums">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
