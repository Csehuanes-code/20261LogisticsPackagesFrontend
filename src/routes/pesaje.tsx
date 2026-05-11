import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Package,
  ChevronRight,
  Box,
  Scale,
  Ruler,
  AlertTriangle,
  ArrowRight,
  Info,
  ShieldAlert,
  Wine,
  PackageSearch,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/AppLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export const Route = createFileRoute("/pesaje")({
  component: PesajePage,
  head: () => ({
    meta: [
      { title: "Pesaje y Dimensiones · HERMES EXPRESS" },
      {
        name: "description",
        content:
          "Pesaje, dimensiones y desglose de precios del paquete — HERMES EXPRESS.",
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
  const navigate = useNavigate();
  const [merch, setMerch] = useState<(typeof merchTypes)[number]["id"]>("estandar");
  const [irregular, setIrregular] = useState(false);
  const [pesoReal, setPesoReal] = useState(52.4);
  const [volumen, setVolumen] = useState(0.084);
  const [showAtypicalDensityAlert, setShowAtypicalDensityAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pesoVolumetrico = volumen * 250;
  const pesoFacturable = Math.max(pesoReal, pesoVolumetrico);

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
      toast.success("¡Ruta solicitada con éxito!", {
        description: "ID de Ruta: R-451-XYZ",
      });
      navigate({ to: "/gestion" });
    }, 2500);
  };

  return (
    <AppLayout icon={<Package className="h-5 w-5 text-primary-foreground" />} title="HERMES EXPRESS">
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
                    Calle 10, Bogotá, CO
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Destinatario
                  </p>
                  <p className="mt-1 font-semibold text-foreground">Ana López</p>
                  <p className="text-xs text-muted-foreground">
                    Av. Principal, Medellín, CO
                  </p>
                </div>
              </div>
            </section>

            {/* Especificaciones técnicas */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <Ruler className="h-4 w-4" />
                  </span>
                  <h2 className="text-sm font-bold text-foreground">
                    Especificaciones Técnicas
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="irregular-switch" className="text-xs font-bold text-muted-foreground">Forma Irregular</Label>
                  <Switch id="irregular-switch" checked={irregular} onCheckedChange={setIrregular} />
                </div>
              </div>

              {irregular && (
                 <Alert variant="default" className="mb-4 flex items-center gap-3">
                  <PackageSearch className="h-5 w-5 text-primary" />
                  <div>
                    <AlertTitle className="font-bold">Modo de Medición Irregular</AlertTitle>
                    <AlertDescription className="text-xs">
                      Mida el paquete usando las dimensiones de la caja contenedora mínima imaginaria que lo envuelve.
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                {["Largo", "Ancho", "Alto"].map((d) => (
                  <div key={d} className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {d} (cm)
                    </label>
                    <Input placeholder="00" type="number" onChange={(e) => setVolumen(((e.target.valueAsNumber || 0) * 80 * 60) / 1000000)} />
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Peso Real (kg)
                </label>
                <div className="relative">
                  <Input placeholder="0.00" type="number" className="pr-12" value={pesoReal} onChange={(e) => setPesoReal(e.target.valueAsNumber)} />
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
              {showAtypicalDensityAlert && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Alerta: Densidad Atípica</AlertTitle>
                  <AlertDescription>
                    La diferencia entre el peso real y el volumétrico supera el 30%. Verifique las medidas y el peso antes de confirmar.
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Volumen Total" value={volumen.toFixed(3)} unit="m³" />
                <Metric label="Peso Volumétrico" value={pesoVolumetrico.toFixed(1)} unit="kg" />
                <Metric
                  label="Peso Facturable"
                  value={pesoFacturable.toFixed(1)}
                  unit="kg"
                  highlight
                />
              </div>
              <p className="mt-4 flex items-start gap-2 text-[11px] italic text-muted-foreground">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                Se toma el valor mayor entre el peso real y el peso volumétrico
                para la facturación. Densidad aplicada: 250 kg/m³.
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
                <Row label="Tarifa Base (Envío Nacional)" value="$ 15.000" />
                <Row label={`Cargo por Peso (${pesoFacturable.toFixed(1)} kg)`} value="$ 45.000" />
                <Row label="Cargo por Distancia (840 km)" value="$ 21.500" />
                <Row
                  label="Recargo 'Carga Especial'"
                  value="+$ 8.500"
                  accent
                />
                <Row label="Seguro de Mercancía" value="$ 4.500" />

                <div className="my-3 border-t border-dashed border-border" />
              </div>

              <div className="mt-5 rounded-xl bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold opacity-90">
                    Total a Pagar (COP)
                  </span>
                  <span className="text-3xl font-bold tracking-tight">
                    $ 94.500
                  </span>
                </div>
              </div>
            </section>

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
                Al confirmar, el paquete se bloqueará para recolección
                inmediata.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
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
