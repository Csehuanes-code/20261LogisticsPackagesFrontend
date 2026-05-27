interface PriceRowProps {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
}

export function PriceRow({ label, value, accent, muted }: PriceRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span>
      <span
        className={`font-semibold tabular-nums ${
          accent ? "text-accent" : muted ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
