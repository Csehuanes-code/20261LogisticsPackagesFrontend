import { Scale, Info } from "lucide-react";
import { PriceRow } from "../shared/PriceRow";
import { MerchandiseType } from "@/domain/enums/merchandise-type.enum";

interface PriceBreakdownViewProps {
  billableWeight: number;
  distanciaKm?: number | null;
  tipoMercancia?: MerchandiseType;
  cargaEspecial?: boolean;
  precioEnvio?: number | null;
  tarifaBase?: number | null;
  tarifaPorKg?: number | null;
  tarifaPorKm?: number | null;
}

// Constantes de tarifas (deben coincidir con backend - application.yml)
// Las tarifas se leen desde TarifasConfigProperties en el backend (BE-3)
const TARIFA_BASE = 5000;
const TARIFA_POR_KG = 250;
const TARIFA_POR_KM = 150;
const RECARGO_FRAGIL = 1000;
const RECARGO_PELIGROSO = 2000;
const RECARGO_CARGA_ESPECIAL = 500;

export function PriceBreakdownView({
  billableWeight,
  distanciaKm,
  tipoMercancia,
  cargaEspecial,
  precioEnvio,
  tarifaBase,
  tarifaPorKg,
  tarifaPorKm,
}: PriceBreakdownViewProps) {
  // Calcular desglose dinámico en tiempo real
  // Usar tarifas de sede si están disponibles, sino usar las globales
  const tarifa_base = tarifaBase ?? TARIFA_BASE;
  const tarifa_por_kg = tarifaPorKg ?? TARIFA_POR_KG;
  const tarifa_por_km = tarifaPorKm ?? TARIFA_POR_KM;
  
  const distancia = distanciaKm ?? 0;
  
  let recargoMercancia = 0;
  if (tipoMercancia === MerchandiseType.FRAGILE) {
    recargoMercancia = RECARGO_FRAGIL;
  } else if (tipoMercancia === MerchandiseType.DANGEROUS) {
    recargoMercancia = RECARGO_PELIGROSO;
  }

  const recargoCategoria = cargaEspecial ? RECARGO_CARGA_ESPECIAL : 0;

  const cargoPeso = billableWeight * tarifa_por_kg;
  const cargoDistancia = distancia * tarifa_por_km;
  
  const total =
    tarifa_base +
    cargoPeso +
    cargoDistancia +
    recargoMercancia +
    recargoCategoria;

  // Si no hay precio real aún, mostrar desglose dinámico estimado
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
          <PriceRow label="Tarifa Base (Envío Nacional)" value={`$${tarifa_base.toLocaleString()}`} />
          
          {billableWeight > 0 && (
            <PriceRow
              label={`Cargo por Peso (${billableWeight.toFixed(2)} kg × $${tarifa_por_kg.toLocaleString()}/kg)`}
              value={`$${cargoPeso.toLocaleString()}`}
            />
          )}

          {distancia > 0 && (
            <PriceRow
              label={`Cargo por Distancia (${distancia.toFixed(1)} km × $${tarifa_por_km}/km)`}
              value={`$${cargoDistancia.toLocaleString()}`}
            />
          )}

          {recargoMercancia > 0 && (
            <PriceRow
              label={`Recargo Tipo Mercancía (${tipoMercancia === MerchandiseType.FRAGILE ? "Frágil" : "Peligroso"})`}
              value={`$${recargoMercancia.toLocaleString()}`}
              accent
            />
          )}

          {recargoCategoria > 0 && (
            <PriceRow
              label="Recargo Carga Especial (>50kg)"
              value={`$${recargoCategoria.toLocaleString()}`}
              accent
            />
          )}

          <div className="my-3 border-t border-dashed border-border" />
          <PriceRow label="Total" value={`$${total.toLocaleString()}`} muted />
        </div>

        <div className="mt-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold opacity-90">Total a Pagar (Estimado)</span>
            <span className="text-3xl font-bold tracking-tight">${total.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-secondary/30 p-3">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Precio estimado basado en datos locales. El precio final será confirmado por el backend al enviar el pesaje.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar precio real después de confirmar (con desglose)
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/15 text-success">
          <Scale className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold text-foreground">Desglose de Precio Confirmado</h2>
      </div>

      <div className="space-y-3 text-sm">
        <PriceRow label="Tarifa Base (Envío Nacional)" value={`$${tarifa_base.toLocaleString()}`} />
        
        {billableWeight > 0 && (
          <PriceRow
            label={`Cargo por Peso (${billableWeight.toFixed(2)} kg × $${tarifa_por_kg.toLocaleString()}/kg)`}
            value={`$${cargoPeso.toLocaleString()}`}
          />
        )}

        {distancia > 0 && (
          <PriceRow
            label={`Cargo por Distancia (${distancia.toFixed(1)} km × $${tarifa_por_km}/km)`}
            value={`$${cargoDistancia.toLocaleString()}`}
          />
        )}

        {recargoMercancia > 0 && (
          <PriceRow
            label={`Recargo Tipo Mercancía (${tipoMercancia === MerchandiseType.FRAGILE ? "Frágil" : "Peligroso"})`}
            value={`$${recargoMercancia.toLocaleString()}`}
            accent
          />
        )}

        {recargoCategoria > 0 && (
          <PriceRow
            label="Recargo Carga Especial (>50kg)"
            value={`$${recargoCategoria.toLocaleString()}`}
            accent
          />
        )}

        <div className="my-3 border-t border-dashed border-border" />
        <PriceRow label="Total (sin IVA)" value={`$${total.toLocaleString()}`} muted />
      </div>

      <div className="mt-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold opacity-90">Total a Pagar</span>
          <span className="text-3xl font-bold tracking-tight">${precioEnvio.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-secondary/30 p-3">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Precio confirmado por el backend. Incluye todos los recargos aplicables.
          </p>
        </div>
      </div>
    </section>
  );
}
