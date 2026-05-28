import { Info } from "lucide-react";

interface ShipmentSummaryProps {
  remitenteNombre: string | null;
  destinatarioNombre: string | null;
  direccionDestino: string | null;
  sedeNombre: string | null;
}

export function ShipmentSummary({ 
  remitenteNombre, 
  destinatarioNombre, 
  direccionDestino,
  sedeNombre
}: ShipmentSummaryProps) {
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
          <p className="mt-1 font-semibold text-foreground">{remitenteNombre || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{sedeNombre || "Sede no especificada"}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Destinatario
          </p>
          <p className="mt-1 font-semibold text-foreground">{destinatarioNombre || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{direccionDestino || "Sin dirección"}</p>
        </div>
      </div>
    </section>
  );
}
