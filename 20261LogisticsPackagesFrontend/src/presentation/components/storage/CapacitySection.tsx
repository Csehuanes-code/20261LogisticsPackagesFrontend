import { BarChart3 } from "lucide-react";
import { CapacityBar } from "../shared/CapacityBar";

interface CapacitySectionProps {
  pesoActualKg?: number;
  capacidadMaxKg?: number;
  volumenActualM3?: number;
  capacidadMaxM3?: number;
  contadorPaquetes?: number;
  capacidadMaxPaquetes?: number;
}

export function CapacitySection({
  pesoActualKg = 0,
  capacidadMaxKg = 1,
  volumenActualM3 = 0,
  capacidadMaxM3 = 1,
  contadorPaquetes = 0,
  capacidadMaxPaquetes = 1,
}: CapacitySectionProps) {
  // Calcular porcentajes
  const pctPeso = capacidadMaxKg > 0 ? Math.round((pesoActualKg / capacidadMaxKg) * 100) : 0;
  const pctVolumen = capacidadMaxM3 > 0 ? Math.round((volumenActualM3 / capacidadMaxM3) * 100) : 0;
  const pctPaquetes = capacidadMaxPaquetes > 0 ? Math.round((contadorPaquetes / capacidadMaxPaquetes) * 100) : 0;

  // Formatear valores
  const pesoFormatted = `${pesoActualKg.toFixed(1)} / ${capacidadMaxKg.toFixed(1)} Kg`;
  const volumenFormatted = `${volumenActualM3.toFixed(1)} / ${capacidadMaxM3.toFixed(1)} m³`;
  const paquetesFormatted = `${contadorPaquetes.toLocaleString("es-CO")} / ${capacidadMaxPaquetes.toLocaleString("es-CO")}`;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Estado de Capacidad</h2>
      </div>
      <div className="space-y-3 text-sm">
        <CapacityBar label="Peso Total" value={pesoFormatted} pct={pctPeso} color="bg-warning" />
        <CapacityBar label="Volumen (m³)" value={volumenFormatted} pct={pctVolumen} color="bg-primary" />
        <CapacityBar label="Cantidad Paquetes" value={paquetesFormatted} pct={pctPaquetes} color="bg-success" />
      </div>
    </section>
  );
}
