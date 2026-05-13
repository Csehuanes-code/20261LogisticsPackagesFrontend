import { useState, useEffect } from "react";
import { Package, ChevronRight, AlertTriangle, ArrowRight, LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { ShipmentSummary } from "../components/weighing/ShipmentSummary";
import { TechnicalSpecs } from "../components/weighing/TechnicalSpecs";
import { MerchandiseTypeSelector } from "../components/weighing/MerchandiseTypeSelector";
import { MetricsDisplay } from "../components/weighing/MetricsDisplay";
import { PriceBreakdownView } from "../components/weighing/PriceBreakdown";
import { toast } from "sonner";
import { MerchandiseType } from "@/domain/enums/merchandise-type.enum";

const DENSITY_FACTOR = 250;

export function WeighingPage() {
  const navigate = useNavigate();
  const [merch, setMerch] = useState<MerchandiseType>(MerchandiseType.STANDARD);
  const [pesoReal, setPesoReal] = useState(52.4);
  const [volumen, setVolumen] = useState(0.084);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pesoVolumetrico = volumen * DENSITY_FACTOR;
  const pesoFacturable = Math.max(pesoReal, pesoVolumetrico);

  const [showAtypicalDensityAlert, setShowAtypicalDensityAlert] = useState(false);

  useEffect(() => {
    const diff = Math.abs(pesoReal - pesoVolumetrico);
    const percentageDiff = (diff / Math.max(pesoReal, pesoVolumetrico)) * 100;
    setShowAtypicalDensityAlert(percentageDiff > 30);
  }, [pesoReal, pesoVolumetrico]);

  const handleConfirm = () => {
    setIsSubmitting(true);
    toast.loading("Solicitando ruta al Módulo de Gestión de Rutas...");
    setTimeout(() => {
      setIsSubmitting(false);
      toast.dismiss();
      toast.success("¡Ruta solicitada con éxito!", { description: "ID de Ruta: R-451-XYZ" });
      navigate({ to: "/gestion" });
    }, 2500);
  };

  return (
    <AppLayout
      icon={<Package className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS"
    >
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <BreadcrumbNav items={[{ label: "Admisión", to: "/admision" }, { label: "Pesaje" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Pesaje y Dimensiones
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              UUID: <span className="font-mono">PRX-9823-UUID</span>
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-4 py-2 text-sm font-semibold text-foreground">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Carga Especial (&gt;50kg)
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <ShipmentSummary />
            <TechnicalSpecs onDimensionsChange={setVolumen} onWeightChange={setPesoReal} />
            <MetricsDisplay
              volumeM3={volumen}
              volumetricWeight={pesoVolumetrico}
              billableWeight={pesoFacturable}
              hasAtypicalDensity={showAtypicalDensityAlert}
            />
            <MerchandiseTypeSelector value={merch} onChange={setMerch} />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <PriceBreakdownView billableWeight={pesoFacturable} />
            <div className="space-y-3">
              <Button
                size="lg"
                className="h-14 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)] transition-transform hover:scale-[1.01] hover:shadow-lg"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? "Solicitando Ruta..." : "Confirmar y Solicitar Ruta"}
              </Button>
              <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Al confirmar, el paquete se bloqueará para recolección inmediata.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
