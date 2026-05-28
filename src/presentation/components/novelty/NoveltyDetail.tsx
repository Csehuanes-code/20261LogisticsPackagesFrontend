import { AlertTriangle, Paperclip } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Novelty } from "@/domain/entities/novelty.entity";
import { VisorNovedades } from "./VisorNovedades";

interface NoveltyDetailProps {
  novelty: Novelty;
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

export function NoveltyDetail({ novelty }: NoveltyDetailProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">Detalles del Paquete #{novelty.packageId}</h2>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
            novelty.priority === "high"
              ? "bg-destructive/15 text-destructive"
              : novelty.priority === "medium"
                ? "bg-warning/20 text-warning"
                : "bg-secondary text-muted-foreground"
          }`}
        >
          {novelty.status}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Cell label="Tipo de Novedad" value={novelty.type} />
        <Cell label="Origen" value={novelty.origin} />
        <Cell label="Reportado Por" value={novelty.reportedBy.slice(0, 8)} />
      </div>

      {novelty.description && (
        <div className="mt-6">
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Descripción de la Novedad</AlertTitle>
            <AlertDescription>{novelty.description}</AlertDescription>
          </Alert>
        </div>
      )}

       {novelty.evidence && (
         <div className="mt-4 rounded-lg border border-border bg-background p-3">
           <p className="mb-2 text-xs font-bold text-muted-foreground">Evidencia Adjunta</p>
           <a
             href="#"
             className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
           >
             <Paperclip className="h-4 w-4" />
             {novelty.evidence}
           </a>
         </div>
       )}

       {/* MOD1-UC-007: Historial inmutable de transiciones desde el backend */}
       <div className="mt-6">
         <VisorNovedades paqueteId={novelty.packageId} />
       </div>
    </div>
  );
}
