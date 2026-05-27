interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}

export function MetricCard({ label, value, unit, highlight }: MetricCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-transparent bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-elevated)]"
          : "border-border bg-card"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          highlight ? "opacity-80" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight">
        {value}
        <span
          className={`ml-1 text-xs font-medium ${highlight ? "opacity-80" : "text-muted-foreground"}`}
        >
          {unit}
        </span>
      </p>
    </div>
  );
}
