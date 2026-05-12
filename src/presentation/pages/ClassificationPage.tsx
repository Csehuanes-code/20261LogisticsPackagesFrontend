import { useState } from "react";
import { ChevronRight, Warehouse, CheckCircle2, Compass, Truck, LoaderCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { PackageInfoCard } from "../components/classification/PackageInfoCard";
import { DestinationZoneList } from "../components/classification/DestinationZoneList";
import { toast } from "sonner";

const packageInfo = {
  uuid: "PRX-9823-UUID",
  type: "Frágil",
  destination: "Monterrey, MX",
};

export function ClassificationPage() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    toast.loading("Confirmando clasificación y actualizando estado...");
    setTimeout(() => {
      setIsConfirming(false);
      setIsConfirmed(true);
      toast.dismiss();
      toast.success("Paquete clasificado y listo para despacho.", {
        description: "El estado del paquete ha sido actualizado a 'Listo para Despacho'.",
      });
    }, 2000);
  };

  return (
    <AppLayout
      icon={<Warehouse className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS Bodega"
      subtitle="Clasificación de Paquetes"
    >
      <main className="mx-auto max-w-4xl px-6 py-8">
        <BreadcrumbNav
          items={[{ label: "Gestión de Ingreso", to: "/gestion" }, { label: "Clasificación" }]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Clasificación por Zona de Destino
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paquete: <span className="font-mono font-semibold">{packageInfo.uuid}</span>
          </p>
        </div>

        {isConfirmed && (
          <Alert variant="success" className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle className="font-bold">Proceso Completado</AlertTitle>
            <AlertDescription>
              Este paquete ya fue clasificado. Puede escanear un nuevo paquete en la pantalla de
              Gestión.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <PackageInfoCard
              type={packageInfo.type}
              destination={packageInfo.destination}
              highlight
            />
            <section className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <Compass className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Zona de Destino Sugerida
                  </p>
                  <p className="text-lg font-bold text-foreground">Zona Norte</p>
                  <p className="text-xs text-muted-foreground">
                    Calculado por proximidad geográfica del destino.
                  </p>
                </div>
                <Button size="sm" disabled={isConfirming || isConfirmed} onClick={handleConfirm}>
                  Aceptar
                </Button>
              </div>
            </section>
          </div>
          <DestinationZoneList confirmed={isConfirmed} />
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            className="h-12 bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]"
            onClick={handleConfirm}
            disabled={isConfirming || isConfirmed}
          >
            {isConfirming ? (
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Truck className="mr-2 h-5 w-5" />
            )}
            {isConfirming
              ? "Confirmando..."
              : isConfirmed
                ? "Clasificación Completa"
                : "Confirmar y Mover a Despacho"}
          </Button>
        </div>
      </main>
    </AppLayout>
  );
}
