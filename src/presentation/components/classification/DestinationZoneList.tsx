import { Map, ShieldAlert, AlertCircle } from "lucide-react";
import { DestinationZoneSelector } from "../storage/ZoneCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DestinationZoneDTO } from "@/infrastructure/http/storage-api.service";

interface DestinationZoneListProps {
  zones: DestinationZoneDTO[];
  suggestedZoneId?: string;
  confirmed?: boolean;
  onZoneSelect?: (zoneId: string) => void;
}

export function DestinationZoneList({ 
  zones,
  suggestedZoneId, 
  confirmed,
  onZoneSelect 
}: DestinationZoneListProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <h3 className="mb-4 text-base font-bold text-foreground">Zonas de Destino Disponibles</h3>
      <Alert className="mb-4 bg-blue/5 border-blue/20">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-muted-foreground">
          La zona sugerida en el panel anterior ha sido calculada automáticamente por proximidad geográfica del destino. 
          Se recomienda aceptarla a menos que haya una razón específica para cambiarla.
        </AlertDescription>
      </Alert>
      <div className="space-y-3">
        {zones.length > 0 ? (
           zones.map((zone: DestinationZoneDTO) => {
             // Determinar si esta zona es la sugerida
             const isActive = suggestedZoneId ? suggestedZoneId === zone.id : false;
             
             // La clasificación es solo por proximidad geográfica, sin restricciones por tipo de mercancía
             const isDisabled = confirmed;
             
             const icon = zone.categoria === "ALTO_RIESGO" ? <ShieldAlert /> : <Map />;
            
            return (
              <button
                key={zone.id}
                onClick={() => {
                  if (!isDisabled && onZoneSelect) {
                    onZoneSelect(zone.id);
                  }
                }}
                disabled={isDisabled}
                className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${
                  isActive ? "border-primary bg-primary/5" : "border-border bg-background"
                } ${isDisabled ? "pointer-events-none opacity-50" : "hover:bg-secondary/40"}`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    isActive ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {icon}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{zone.nombre}</p>
                  <p className="text-xs text-muted-foreground">{zone.codigo}</p>
                </div>
                {isActive && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Cargando zonas disponibles...
          </p>
        )}
      </div>
    </section>
  );
}
