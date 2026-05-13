import { Scale } from "lucide-react";
import { PriceRow } from "../shared/PriceRow";

interface PriceBreakdownViewProps {
  billableWeight: number;
}

export function PriceBreakdownView({ billableWeight }: PriceBreakdownViewProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/15 text-success">
          <Scale className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold text-foreground">Desglose de Precio</h2>
      </div>

      <div className="space-y-3 text-sm">
        <PriceRow label="Tarifa Base (Envío Nacional)" value="$120.00" />
        <PriceRow label={`Cargo por Peso (${billableWeight.toFixed(1)} kg)`} value="$450.00" />
        <PriceRow label="Cargo por Distancia (840 km)" value="$215.00" />
        <PriceRow label="Recargo 'Carga Especial'" value="+$85.00" accent />
        <PriceRow label="Seguro de Mercancía" value="$45.00" />
        <div className="my-3 border-t border-dashed border-border" />
        <PriceRow label="Subtotal" value="$915.00" muted />
        <PriceRow label="IVA (16%)" value="$146.40" muted />
      </div>

      <div className="mt-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold opacity-90">Total a Pagar</span>
          <span className="text-3xl font-bold tracking-tight">$1,061.40</span>
        </div>
      </div>
    </section>
  );
}
