import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Compass,
  Map,
  Truck,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export const Route = createFileRoute("/clasificacion")({
  component: ClasificacionPage,
  head: () => ({
    meta: [
      { title: "Clasificación por Zona · PROSHITS" },
      {
        name: "description",
        content: "Clasificación de paquetes por zona de destino para optimizar la carga.",
      },
    ],
  }),
});

const packageInfo = {
  uuid: "PRX-9823-UUID",
  type: "Frágil",
  destination: "Monterrey, MX",
};

function ClasificacionPage() {
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
      title="PROSHITS Bodega"
      subtitle="Clasificación de Paquetes"
    >
      <main className="mx-auto max-w-4xl px-6 py-8">
        <nav className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/gestion" className="hover:text-foreground">
            Gestión de Ingreso
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">Clasificación</span>
        </nav>

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
              Este paquete ya fue clasificado. Puede escanear un nuevo paquete en la pantalla de Gestión.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Info y Sugerencia */}
          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="mb-4 text-base font-bold text-foreground">Información del Paquete</h3>
              <div className="space-y-3">
                <InfoRow label="Tipo de Mercancía" value={packageInfo.type} highlight={packageInfo.type !== 'Estándar'} />
                <InfoRow label="Ciudad de Destino" value={packageInfo.destination} />
              </div>
            </section>

            <section className="rounded-xl border border-primary/30 bg-primary/5 p-6">
               <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <Compass className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Zona de Destino Sugerida
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    Zona Norte
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Calculado por proximidad geográfica del destino.
                  </p>
                </div>
                <Button size="sm" disabled={isConfirming || isConfirmed} onClick={handleConfirm}>Aceptar</Button>
              </div>
            </section>
          </div>

          {/* Zonas de Destino */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-base font-bold text-foreground">Zonas de Destino Disponibles</h3>
            <div className="space-y-3">
              <ZoneCard title="Zona Norte" icon={<Map />} active disabled={isConfirmed} />
              <ZoneCard title="Zona Occidente" icon={<Map />} disabled={isConfirmed} />
              <ZoneCard title="Zona Sur" icon={<Map />} disabled={isConfirmed} />
              <ZoneCard title="Zona de Manejo Especial" icon={<ShieldAlert />} disabled={packageInfo.type !== 'Peligroso' || isConfirmed} />
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
           <Button
              size="lg"
              className="h-12 bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]"
              onClick={handleConfirm}
              disabled={isConfirming || isConfirmed}
            >
              {isConfirming ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : <Truck className="mr-2 h-5 w-5" />}
              {isConfirming ? 'Confirmando...' : (isConfirmed ? 'Clasificación Completa' : 'Confirmar y Mover a Despacho')}
            </Button>
        </div>
      </main>
    </AppLayout>
  );
}

function InfoRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-warning' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

function ZoneCard({ title, icon, active = false, disabled = false }: { title: string; icon: React.ReactNode; active?: boolean; disabled?: boolean }) {
  return (
    <button
      className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${
        active ? "border-primary bg-primary/5" : "border-border bg-background"
      } ${disabled ? "opacity-50 pointer-events-none" : "hover:bg-secondary/40"}`}
      disabled={disabled}
    >
      <span className={`flex h-8 w-8 items-center justify-center rounded-md ${active ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
        {icon}
      </span>
      <span className="font-bold text-foreground">{title}</span>
      {active && <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />}
    </button>
  );
}
