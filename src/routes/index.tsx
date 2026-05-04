import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  Warehouse,
  AlertTriangle,
  ArrowRight,
  CircleUser,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Inicio · PROSHITS" },
      {
        name: "description",
        content:
          "Panel principal de PROSHITS — admisión, gestión de ingreso y control de novedades logísticas.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-[var(--shadow-elevated)]">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight text-foreground">
                PROSHITS
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Logística Profesional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sede Actual
              </p>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Sede Central · ID 001
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <CircleUser className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </header>

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

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-xs text-muted-foreground">
          <p>© 2024 PROSHITS S.A. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground">
              Soporte Técnico
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ModuleCard({
  to,
  icon,
  title,
  description,
  iconBg,
}: {
  to: "/admision" | "/gestion" | "/novedades";
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
