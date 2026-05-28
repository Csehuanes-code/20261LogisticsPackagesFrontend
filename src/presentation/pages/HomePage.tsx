import { Package, Warehouse, AlertTriangle, Truck } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { ModuleCard } from "../components/shared/ModuleCard";

export function HomePage() {
  return (
    <AppLayout
      icon={<Package className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS"
    >
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Panel Principal
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Centro de Operaciones
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            Selecciona un módulo para comenzar tu jornada operativa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <ModuleCard
            to="/admision"
            icon={<Package className="h-6 w-6" />}
            title="Admisión de Paquete"
            description="Registro de nuevos envíos, datos de remitente y destinatario."
            iconBg="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
          />
          <ModuleCard
            to="/gestion"
            icon={<Warehouse className="h-6 w-6" />}
            title="Gestión de Ingreso"
            description="Asignación de zonas, almacenaje y clasificación de paquetes."
            iconBg="bg-gradient-to-br from-accent to-warning text-accent-foreground"
          />
          <ModuleCard
            to="/novedades"
            icon={<AlertTriangle className="h-6 w-6" />}
            title="Control de Novedades"
            description="Seguimiento de incidencias, daños y reportes en ruta."
            iconBg="bg-gradient-to-br from-destructive to-warning text-destructive-foreground"
          />
          <ModuleCard
            to="/tracking"
            icon={<Truck className="h-6 w-6" />}
            title="Seguimiento de Paquetes"
            description="Consulta el estado, historial y ubicación de cualquier envío."
            iconBg="bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
          />
        </div>
      </main>
    </AppLayout>
  );
}
