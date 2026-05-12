import { Map, ShieldAlert } from "lucide-react";
import { DestinationZoneSelector } from "../storage/ZoneCard";

interface DestinationZoneListProps {
  dangerousType?: boolean;
  confirmed: boolean;
}

export function DestinationZoneList({ dangerousType, confirmed }: DestinationZoneListProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <h3 className="mb-4 text-base font-bold text-foreground">Zonas de Destino Disponibles</h3>
      <div className="space-y-3">
        <DestinationZoneSelector title="Zona Norte" icon={<Map />} active disabled={confirmed} />
        <DestinationZoneSelector title="Zona Occidente" icon={<Map />} disabled={confirmed} />
        <DestinationZoneSelector title="Zona Sur" icon={<Map />} disabled={confirmed} />
        <DestinationZoneSelector
          title="Zona de Manejo Especial"
          icon={<ShieldAlert />}
          disabled={!dangerousType || confirmed}
        />
      </div>
    </section>
  );
}
