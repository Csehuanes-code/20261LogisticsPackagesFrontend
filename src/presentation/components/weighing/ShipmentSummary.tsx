import { Info } from "lucide-react";

export function ShipmentSummary() {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Info className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold text-foreground">Resumen del Envío</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Remitente
          </p>
          <p className="mt-1 font-semibold text-foreground">Juan Pérez</p>
          <p className="text-xs text-muted-foreground">Calle 10, CDMX, MX</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Destinatario
          </p>
          <p className="mt-1 font-semibold text-foreground">Ana López</p>
          <p className="text-xs text-muted-foreground">Av. Principal, Monterrey, MX</p>
        </div>
      </div>
    </section>
  );
}
