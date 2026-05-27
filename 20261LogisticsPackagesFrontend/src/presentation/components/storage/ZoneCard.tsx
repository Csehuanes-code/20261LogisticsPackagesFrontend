import { CheckCircle2 } from "lucide-react";

interface ZoneCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function ZoneCard({ icon, title, desc, color, active, disabled }: ZoneCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        active
          ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
          : "border-border bg-background"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <span className={color}>{icon}</span>
      <p className="mt-3 text-sm font-bold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

export function DestinationZoneSelector({
  title,
  icon,
  active,
  disabled,
}: {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${
        active ? "border-primary bg-primary/5" : "border-border bg-background"
      } ${disabled ? "pointer-events-none opacity-50" : "hover:bg-secondary/40"}`}
      disabled={disabled}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-md ${
          active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="font-bold text-foreground">{title}</span>
      {active && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
    </button>
  );
}
