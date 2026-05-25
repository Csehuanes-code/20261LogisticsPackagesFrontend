import { useState } from "react";
import { ClipboardCheck, Sparkles, ShieldAlert, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ZoneCard } from "./ZoneCard";
import { ZoneCategory } from "@/domain/enums/zone-category.enum";

interface ZoneAssignmentPanelProps {
  suggestedZone: string;
  isSaturated: boolean;
  zonaCategoria?: string;
  nombreZonaPrincipal?: string;
}

export function ZoneAssignmentPanel({
  suggestedZone,
  isSaturated,
  zonaCategoria,
  nombreZonaPrincipal,
}: ZoneAssignmentPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ClipboardCheck className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold text-foreground">Panel de Asignación de Zona</h2>
      </div>

      {isSaturated && nombreZonaPrincipal && (
        <Alert className="mb-4 border-warning/30 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle>Zona Sugerida Saturada</AlertTitle>
          <AlertDescription>
            La zona {nombreZonaPrincipal} ha alcanzado su capacidad. Se sugiere zona de contingencia: {suggestedZone}.
          </AlertDescription>
        </Alert>
      )}

      <div
        className={`rounded-xl border p-5 ${
          isSaturated ? "border-warning/30 bg-warning/5" : "border-primary/20 bg-primary/5"
        }`}
      >
        <div className="flex items-start gap-4">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground ${
              isSaturated ? "bg-warning" : "bg-gradient-to-br from-primary to-primary-glow"
            }`}
          >
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p
              className={`text-[10px] font-bold uppercase tracking-wider ${isSaturated ? "text-warning" : "text-primary"}`}
            >
              Sugerencia Automática
            </p>
            <p className="text-lg font-bold text-foreground">
              {suggestedZone}
            </p>
            <p className="text-xs text-muted-foreground">
              Categoría: {zonaCategoria || "Desconocida"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ZoneCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          title="Zona Normal"
          desc="Carga general, sin riesgos específicos."
          color="text-muted-foreground"
          active={zonaCategoria === "NORMAL"}
        />
        <ZoneCard
          icon={<Sparkles className="h-5 w-5" />}
          title="Zona Delicada"
          desc="Equipos electrónicos, vidrio, arte."
          color="text-primary"
          active={zonaCategoria === "DELICADA"}
        />
        <ZoneCard
          icon={<ShieldAlert className="h-5 w-5" />}
          title="Alto Riesgo"
          desc="Químicos, inflamables o pesados."
          color="text-destructive"
          active={zonaCategoria === "ALTO_RIESGO"}
        />
      </div>
    </section>
  );
}
