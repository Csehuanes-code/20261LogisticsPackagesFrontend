import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  Warehouse,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ClipboardCheck,
  ShieldAlert,
  FileText,
  BarChart3,
  Route as RouteIcon,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/AppLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/gestion")({
  component: GestionPage,
  head: () => ({
    meta: [
      { title: "Gestión de Ingreso · HERMES EXPRESS" },
      {
        name: "description",
        content:
          "Asignación de zonas, almacenaje y clasificación de paquetes — HERMES EXPRESS.",
      },
    ],
  }),
});

function GestionPage() {
  const navigate = useNavigate();
  const [zonaSaturada, setZonaSaturada] = useState(false);
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
              placeholder="Buscar por UUID del paquete (ej: PRX-9823-UUID)"
              defaultValue="PRX-9823-UUID"
            />
          </div>
        </section>

        <Alert className="mb-6 bg-primary/5 border-primary/20">
          <RouteIcon className="h-4 w-4" />
          <AlertTitle className="font-bold">Ruta Asignada</AlertTitle>
          <AlertDescription>
            El paquete con UUID <span className="font-mono font-semibold">PRX-9823-UUID</span> ha sido asignado a la ruta <span className="font-mono font-semibold">R-451-XYZ</span>.
          </AlertDescription>
        </Alert>

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
              <div className="flex items-center space-x-2">
                <Label htmlFor="saturated-zone-switch" className="text-xs font-bold text-muted-foreground">Simular Zona Saturada</Label>
                <Switch id="saturated-zone-switch" checked={zonaSaturada} onCheckedChange={setZonaSaturada} />
              </div>
            </div>

            {zonaSaturada && (
              <Alert variant="warning" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Zona Sugerida Saturada</AlertTitle>
                <AlertDescription>
                  La zona A-12 ha alcanzado su capacidad. Se sugiere zona de contingencia.
                </AlertDescription>
              </Alert>
            )}

            <div className={`rounded-xl border p-5 ${zonaSaturada ? 'border-warning/30 bg-warning/5' : 'border-primary/20 bg-primary/5'}`}>
              <div className="flex items-start gap-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground ${zonaSaturada ? 'bg-warning' : 'bg-gradient-to-br from-primary to-primary-glow'}`}>
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${zonaSaturada ? 'text-warning' : 'text-primary'}`}>
                    Sugerencia Automática
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {zonaSaturada ? 'Zona C-01 (Contingencia)' : 'Zona A-12 (Delicada)'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {zonaSaturada ? 'Asignado por: Desborde de zona A-12' : 'Asignado por: Fragilidad Alta + Dimensiones < 50cm'}
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
                disabled={true}
              />
              <ZoneCard
                icon={<Sparkles className="h-5 w-5" />}
                title="Zona Delicada"
                desc="Equipos electrónicos, vidrio, arte."
                color="text-primary"
                active={!zonaSaturada}
              />
              <ZoneCard
                icon={<ShieldAlert className="h-5 w-5" />}
                title="Alto Riesgo"
                desc="Químicos, inflamables o pesados."
                color="text-destructive"
                disabled={true}
              />
            </div>
          </section>

          {/* Acciones */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="h-12 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              {isConfirming ? 'Confirmando...' : 'Confirmar Almacenaje'}
            </Button>
            <Button asChild variant="outline" className="h-12 w-full">
              <Link to="/discrepancia">
                <FileText className="h-4 w-4" />
                Reportar Discrepancia Física
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 w-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive">
              <Link to="/reportar-novedad">
                <AlertTriangle className="h-4 w-4" />
                Reportar Novedad (Daño/Extra)
              </Link>
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
    </AppLayout>
  );
}

function ZoneCard({
  icon,
  title,
  desc,
  color,
  active,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        active ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]" : "border-border bg-background"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
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
