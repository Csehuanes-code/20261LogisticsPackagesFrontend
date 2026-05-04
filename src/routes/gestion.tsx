import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  ChevronRight,
  CircleUser,
  Warehouse,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ClipboardCheck,
  ShieldAlert,
  FileText,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/gestion")({
  component: GestionPage,
  head: () => ({
    meta: [
      { title: "Gestión de Ingreso · PROSHITS" },
      {
        name: "description",
        content:
          "Asignación de zonas, almacenaje y clasificación de paquetes — PROSHITS.",
      },
    ],
  }),
});

function GestionPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-[var(--shadow-elevated)]">
              <Warehouse className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight text-foreground">
                PROSHITS Bodega
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Gestión de Ingreso
              </p>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <CircleUser className="h-5 w-5 text-primary" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">Gestión de Ingreso</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gestión de Ingreso y Almacenaje
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escanee o ingrese el identificador único para procesar el paquete.
          </p>
        </div>

        {/* Buscador */}
        <section className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="relative mx-auto max-w-2xl">
            <ScanLine className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-14 rounded-xl pl-12 text-base"
              placeholder="Buscar por UUID del paquete"
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Asignación zona */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <ClipboardCheck className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-bold text-foreground">
                  Panel de Asignación de Zona
                </h2>
              </div>
              <span className="rounded-full bg-success/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                Paquete Identificado
              </span>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Sugerencia Automática
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    Zona A-12 (Delicada)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Asignado por: Fragilidad Alta + Dimensiones &lt; 50cm
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Aceptar</Button>
                  <Button size="sm" variant="outline">
                    Cambiar
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <ZoneCard
                icon={<ClipboardCheck className="h-5 w-5" />}
                title="Zona Normal"
                desc="Carga general, sin riesgos específicos."
                color="text-muted-foreground"
              />
              <ZoneCard
                icon={<Sparkles className="h-5 w-5" />}
                title="Zona Delicada"
                desc="Equipos electrónicos, vidrio, arte."
                color="text-primary"
                active
              />
              <ZoneCard
                icon={<ShieldAlert className="h-5 w-5" />}
                title="Alto Riesgo"
                desc="Químicos, inflamables o pesados."
                color="text-destructive"
              />
            </div>
          </section>

          {/* Acciones */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="h-12 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]"
            >
              <CheckCircle2 className="h-5 w-5" />
              Confirmar Almacenaje
            </Button>
            <Button asChild variant="outline" className="h-12 w-full">
              <Link to="/discrepancia">
                <FileText className="h-4 w-4" />
                Reportar Discrepancia Física
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
            >
              <AlertTriangle className="h-4 w-4" />
              Reportar Novedad (Daño/Extra)
            </Button>

            {/* Capacidad */}
            <section className="mt-3 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  Estado de Capacidad
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <Capacity label="Peso Total" value="12.5 / 15 Ton" pct={83} color="bg-warning" />
                <Capacity
                  label="Volumen (m³)"
                  value="450 / 800 m³"
                  pct={56}
                  color="bg-primary"
                />
                <Capacity
                  label="Cantidad Paquetes"
                  value="1,240 / 2,000"
                  pct={62}
                  color="bg-success"
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-xs text-muted-foreground">
          <p>© 2024 PROSHITS S.A. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Sistema en línea
          </div>
        </div>
      </footer>
    </div>
  );
}

function ZoneCard({
  icon,
  title,
  desc,
  color,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        active
          ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
          : "border-border bg-background"
      }`}
    >
      <span className={color}>{icon}</span>
      <p className="mt-3 text-sm font-bold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function Capacity({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-bold text-foreground tabular-nums">
          {value}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
