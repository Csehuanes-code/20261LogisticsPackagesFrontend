import { Map, ShieldAlert, AlertCircle } from "lucide-react";
import { DestinationZoneSelector } from "../storage/ZoneCard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DestinationZoneListProps {
  dangerousType?: boolean;
  confirmed: boolean;
}

export function DestinationZoneList({ dangerousType, confirmed }: DestinationZoneListProps) {
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
        <DestinationZoneSelector 
          title="Zona Norte" 
          icon={<Map />} 
          active 
          disabled={confirmed} 
        />
        <DestinationZoneSelector 
          title="Zona Occidente" 
          icon={<Map />} 
          disabled={confirmed} 
        />
        <DestinationZoneSelector 
          title="Zona Sur" 
          icon={<Map />} 
          disabled={confirmed} 
        />
        <DestinationZoneSelector
          title="Zona de Manejo Especial"
          icon={<ShieldAlert />}
          disabled={!dangerousType || confirmed}
        />
      </div>
    </section>
  );
}
