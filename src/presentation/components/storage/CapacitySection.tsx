import { BarChart3 } from "lucide-react";
import { CapacityBar } from "../shared/CapacityBar";

export function CapacitySection() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Estado de Capacidad</h2>
      </div>
      <div className="space-y-3 text-sm">
        <CapacityBar label="Peso Total" value="12.5 / 15 Ton" pct={83} color="bg-warning" />
        <CapacityBar label="Volumen (m³)" value="450 / 800 m³" pct={56} color="bg-primary" />
        <CapacityBar label="Cantidad Paquetes" value="1,240 / 2,000" pct={62} color="bg-success" />
      </div>
    </section>
  );
}
