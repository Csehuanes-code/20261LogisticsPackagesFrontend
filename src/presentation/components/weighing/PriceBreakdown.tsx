import { Scale } from "lucide-react";
import { PriceRow } from "../shared/PriceRow";

interface PriceBreakdownViewProps {
  billableWeight: number;
  precioEnvio?: number | null;
}

export function PriceBreakdownView({ billableWeight, precioEnvio }: PriceBreakdownViewProps) {
  // Si no hay precio real aún, mostrar placeholder
  if (precioEnvio === null || precioEnvio === undefined) {
    return (
      <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/15 text-success">
            <Scale className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-foreground">Desglose de Precio</h2>
        </div>

        <div className="space-y-3 text-sm">
          <PriceRow label="Tarifa Base (Envío Nacional)" value="Pendiente" />
          <PriceRow label={`Cargo por Peso (${billableWeight.toFixed(1)} kg)`} value="Pendiente" />
          <PriceRow label="Cargo por Distancia" value="Pendiente" />
          <PriceRow label="Recargos aplicables" value="Pendiente" accent />
          <PriceRow label="Seguro de Mercancía" value="Pendiente" />
          <div className="my-3 border-t border-dashed border-border" />
          <PriceRow label="Subtotal" value="Pendiente" muted />
          <PriceRow label="IVA (16%)" value="Pendiente" muted />
        </div>

        <div className="mt-5 rounded-xl bg-gradient-to-br from-muted to-muted-foreground p-5 text-muted-foreground shadow-[var(--shadow-elevated)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold opacity-90">Total a Pagar</span>
            <span className="text-3xl font-bold tracking-tight">Calculando...</span>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar precio real después de confirmar
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/15 text-success">
          <Scale className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold text-foreground">Desglose de Precio</h2>
      </div>

      <div className="space-y-3 text-sm">
        <PriceRow label="Precio Final del Envío" value={`$${precioEnvio.toFixed(2)}`} accent />
        <div className="my-3 border-t border-dashed border-border" />
      </div>

      <div className="mt-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold opacity-90">Total a Pagar</span>
          <span className="text-3xl font-bold tracking-tight">${precioEnvio.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}
