import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MetricCard } from "../shared/MetricCard";

interface MetricsDisplayProps {
  volumeM3: number;
  volumetricWeight: number;
  billableWeight: number;
  hasAtypicalDensity: boolean;
}

export function MetricsDisplay({
  volumeM3,
  volumetricWeight,
  billableWeight,
  hasAtypicalDensity,
}: MetricsDisplayProps) {
  return (
    <section className="rounded-xl border border-border bg-secondary/40 p-6">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Métricas de Cálculo
      </p>
      {hasAtypicalDensity && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alerta: Densidad Atípica</AlertTitle>
          <AlertDescription>
            La diferencia entre el peso real y el volumétrico supera el 30%. Verifique las medidas y
            el peso antes de confirmar.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Volumen Total" value={volumeM3.toFixed(3)} unit="m³" />
        <MetricCard label="Peso Volumétrico" value={volumetricWeight.toFixed(1)} unit="kg" />
        <MetricCard label="Peso Facturable" value={billableWeight.toFixed(1)} unit="kg" highlight />
      </div>
      <p className="mt-4 flex items-start gap-2 text-[11px] italic text-muted-foreground">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        Se toma el valor mayor entre el peso real y el peso volumétrico para la facturación.
        Densidad aplicada: 250 kg/m³.
      </p>
    </section>
  );
}
