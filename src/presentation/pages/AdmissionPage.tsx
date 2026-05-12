import { Package, ChevronRight, Truck, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { SenderForm } from "../components/admission/SenderForm";
import { RecipientForm } from "../components/admission/RecipientForm";
import { CoverageMap } from "../components/admission/CoverageMap";
import { ShippingInfoSection } from "../components/admission/ShippingInfoSection";

export function AdmissionPage() {
  return (
    <AppLayout
      icon={<Package className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS"
    >
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <BreadcrumbNav items={[{ label: "Admisión" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Admisión de Paquete
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              MOD1-UC-001 · Registro de nuevo envío
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-4 py-2 text-sm font-semibold text-foreground">
            <span className="flex h-2 w-2 rounded-full bg-warning shadow-[0_0_0_4px_oklch(0.72_0.17_65/0.2)]" />
            Paso 1: Datos Generales
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <SenderForm />
            <RecipientForm />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <CoverageMap />
            <ShippingInfoSection />
            <div className="space-y-3">
              <Button
                asChild
                size="lg"
                className="h-14 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)] transition-transform hover:scale-[1.01] hover:shadow-lg"
              >
                <Link to="/pesaje">
                  Continuar al Pesaje
                  <Truck className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Alert className="mt-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Recordatorio para el Operador</AlertTitle>
          <AlertDescription>
            Al confirmar el registro y asignarse la ruta, informe al cliente que la fecha estimada
            máxima de entrega es de **7 días hábiles**.
          </AlertDescription>
        </Alert>
      </main>
    </AppLayout>
  );
}
