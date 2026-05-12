import { useState } from "react";
import {
  ChevronRight,
  Warehouse,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Route as RouteIcon,
  LoaderCircle,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { ZoneAssignmentPanel } from "../components/storage/ZoneAssignmentPanel";
import { CapacitySection } from "../components/storage/CapacitySection";
import { toast } from "sonner";

export function StoragePage() {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    toast.loading("Confirmando almacenaje y actualizando estado...");
    setTimeout(() => {
      setIsConfirming(false);
      toast.dismiss();
      toast.success("Paquete almacenado con éxito.", {
        description: "Redirigiendo a la pantalla de clasificación...",
      });
      navigate({ to: "/clasificacion" });
    }, 2000);
  };

  return (
    <AppLayout
      icon={<Warehouse className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS Bodega"
      subtitle="Gestión de Ingreso"
    >
      <main className="mx-auto max-w-7xl px-6 py-8">
        <BreadcrumbNav items={[{ label: "Gestión de Ingreso" }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gestión de Ingreso y Almacenaje
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escanee o ingrese el identificador único para procesar el paquete.
          </p>
        </div>

        <section className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="relative mx-auto max-w-2xl">
            <ScanLine className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-14 rounded-xl pl-12 text-base"
              placeholder="Buscar por UUID del paquete (ej: PRX-9823-UUID)"
              defaultValue="PRX-9823-UUID"
            />
          </div>
        </section>

        <Alert className="mb-6 bg-primary/5 border-primary/20">
          <RouteIcon className="h-4 w-4" />
          <AlertTitle className="font-bold">Ruta Asignada</AlertTitle>
          <AlertDescription>
            El paquete con UUID <span className="font-mono font-semibold">PRX-9823-UUID</span> ha
            sido asignado a la ruta <span className="font-mono font-semibold">R-451-XYZ</span>.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-3">
          <ZoneAssignmentPanel
            suggestedZone="Zona A-12 (Delicada)"
            isSaturated={false}
            onConfirm={handleConfirm}
            isConfirming={isConfirming}
          />

          <div className="space-y-3">
            <Button
              size="lg"
              className="h-12 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
              {isConfirming ? "Confirmando..." : "Confirmar Almacenaje"}
            </Button>
            <Button asChild variant="outline" className="h-12 w-full">
              <Link to="/discrepancia">
                <FileText className="h-4 w-4" />
                Reportar Discrepancia Física
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 w-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
            >
              <Link to="/reportar-novedad">
                <AlertTriangle className="h-4 w-4" />
                Reportar Novedad (Daño/Extra)
              </Link>
            </Button>

            <CapacitySection />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
