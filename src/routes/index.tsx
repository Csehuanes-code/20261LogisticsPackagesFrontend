import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  Warehouse,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Inicio · HERMES EXPRESS" },
      {
        name: "description",
        content:
          "Panel principal de HERMES EXPRESS — admisión, gestión de ingreso y control de novedades logísticas.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <AppLayout icon={<Package className="h-5 w-5 text-primary-foreground" />} title="HERMES EXPRESS">
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

        <div className="grid gap-6 md:grid-cols-3">
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
        </div>
      </main>
    </AppLayout>
  );
}

function ModuleCard({
  to,
  icon,
  title,
  description,
  iconBg,
}: {
  to: "/admision" | "/gestion" | "/novedades" | "/pesaje" | "/discrepancia";
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
}) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-[var(--shadow-elevated)] ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
        Ingresar
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
