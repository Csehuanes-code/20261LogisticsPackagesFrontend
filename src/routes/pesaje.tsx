import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package,
  ChevronRight,
  CircleUser,
  MapPin,
  Box,
  Scale,
  Ruler,
  AlertTriangle,
  ArrowRight,
  Info,
  ShieldAlert,
  Wine,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/pesaje")({
  component: PesajePage,
  head: () => ({
    meta: [
      { title: "Pesaje y Dimensiones · PROSHITS" },
      {
        name: "description",
        content:
          "Pesaje, dimensiones y desglose de precios del paquete — PROSHITS.",
      },
    ],
  }),
});

const merchTypes = [
  { id: "estandar", label: "Estándar", icon: Box },
  { id: "fragil", label: "Frágil", icon: Wine },
  { id: "peligroso", label: "Peligroso", icon: ShieldAlert },
] as const;

function PesajePage() {
  const [merch, setMerch] = useState<(typeof merchTypes)[number]["id"]>(
    "estandar",
  );

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

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-foreground">
                Operador 042
              </p>
              <p className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-accent" />
                Sede Central · ID 001
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <CircleUser className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb + title */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <nav className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Inicio
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/admision" className="hover:text-foreground">
                Admisión
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary">Pesaje</span>
            </nav>
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
          {/* Left column */}
          <div className="space-y-6 lg:col-span-3">
            {/* Resumen del envío */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Info className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-bold text-foreground">
                  Resumen del Envío
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Remitente
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    Juan Pérez
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Calle 10, CDMX, MX
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Destinatario
                  </p>
                  <p className="mt-1 font-semibold text-foreground">Ana López</p>
                  <p className="text-xs text-muted-foreground">
                    Av. Principal, Monterrey, MX
                  </p>
                </div>
              </div>
            </section>

            {/* Especificaciones técnicas */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent">
                  <Ruler className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-bold text-foreground">
                  Especificaciones Técnicas
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {["Largo", "Ancho", "Alto"].map((d) => (
                  <div key={d} className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {d} (cm)
                    </label>
                    <Input placeholder="00" />
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Peso Real (kg)
                </label>
                <div className="relative">
                  <Input placeholder="0.00" className="pr-12" />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    kg
                  </span>
                </div>
                <p className="text-[11px] italic text-muted-foreground">
                  Rango permitido: 0.01 - 70.00 kg
                </p>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Tipo de Mercancía
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {merchTypes.map((t) => {
                    const Icon = t.icon;
                    const active = merch === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setMerch(t.id)}
                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                          active
                            ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
                            : "border-border bg-background hover:border-primary/40"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            active ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            active ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Métricas de cálculo */}
            <section className="rounded-xl border border-border bg-secondary/40 p-6">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Métricas de Cálculo
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Volumen Total" value="0.084" unit="m³" />
                <Metric label="Peso Volumétrico" value="16.8" unit="kg" />
                <Metric
                  label="Peso Facturable"
                  value="52.4"
                  unit="kg"
                  highlight
                />
              </div>
              <p className="mt-4 flex items-start gap-2 text-[11px] italic text-muted-foreground">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                Se toma el valor mayor entre el peso real y el peso volumétrico
                para la facturación. Densidad aplicada: 200 kg/m³.
              </p>
            </section>
          </div>

          {/* Right column — Pricing */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/15 text-success">
                  <Scale className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-bold text-foreground">
                  Desglose de Precio
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <Row label="Tarifa Base (Envío Nacional)" value="$120.00" />
                <Row label="Cargo por Peso (52.4 kg)" value="$450.00" />
                <Row label="Cargo por Distancia (840 km)" value="$215.00" />
                <Row
                  label="Recargo 'Carga Especial'"
                  value="+$85.00"
                  accent
                />
                <Row label="Seguro de Mercancía" value="$45.00" />

                <div className="my-3 border-t border-dashed border-border" />

                <Row label="Subtotal" value="$915.00" muted />
                <Row label="IVA (16%)" value="$146.40" muted />
              </div>

              <div className="mt-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold opacity-90">
                    Total a Pagar
                  </span>
                  <span className="text-3xl font-bold tracking-tight">
                    $1,061.40
                  </span>
                </div>
              </div>
            </section>

            <div className="space-y-3">
              <Button
                size="lg"
                className="h-14 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)] transition-transform hover:scale-[1.01] hover:shadow-lg"
              >
                Confirmar Registro y Solicitar Ruta
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>

              <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Al confirmar, el paquete se bloqueará para recolección
                inmediata.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t border-border bg-card">
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

function Metric({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-transparent bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-elevated)]"
          : "border-border bg-card"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          highlight ? "opacity-80" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight">
        {value}
        <span
          className={`ml-1 text-xs font-medium ${
            highlight ? "opacity-80" : "text-muted-foreground"
          }`}
        >
          {unit}
        </span>
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>
        {label}
      </span>
      <span
        className={`font-semibold tabular-nums ${
          accent
            ? "text-accent"
            : muted
              ? "text-muted-foreground"
              : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
