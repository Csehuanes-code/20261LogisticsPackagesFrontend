import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package,
  ChevronRight,
  CircleUser,
  AlertTriangle,
  Inbox,
  Search,
  Bell,
  UploadCloud,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/novedades")({
  component: NovedadesPage,
  head: () => ({
    meta: [
      { title: "Control de Novedades · PROSHITS" },
      {
        name: "description",
        content:
          "Bandeja de novedades, daños y reportes en ruta — PROSHITS.",
      },
    ],
  }),
});

const novedades = [
  {
    id: "PH-99283",
    title: "Paquete Dañado en Ruta",
    sub: "Reportado por: Carlos Ruiz (Transportista)",
    badge: { label: "Prioridad Alta", color: "bg-destructive/15 text-destructive" },
    time: "10 min",
    active: true,
  },
  {
    id: "PH-88412",
    title: "Intento de Devolución",
    sub: "Bodega Central · Sector B-12",
    badge: { label: "En Revisión", color: "bg-warning/20 text-warning" },
    time: "25 min",
  },
  {
    id: "PH-77109",
    title: "Reporte de Extravío",
    sub: "Reportado desde: HUB Logístico Norte",
    badge: { label: "Pendiente", color: "bg-secondary text-muted-foreground" },
    time: "1 h",
  },
];

const trazabilidad = [
  {
    label: "Salida de Bodega Central",
    time: "22/10/2025 - 08:30:15 AM",
    hash: "8f2b...1e90",
    state: "ok",
  },
  {
    label: "En Tránsito - Punto de Control A",
    time: "22/10/2025 - 11:45:22 AM",
    hash: "a4e1...f4d2",
    state: "ok",
  },
  {
    label: "Novedad Reportada: Daño en Empaque",
    time: "22/10/2025 - 02:15:40 PM",
    hash: "3c9d...bb81",
    state: "alert",
  },
] as const;

function NovedadesPage() {
  const [tab, setTab] = useState<"pendientes" | "historial">("pendientes");
  const [tipo, setTipo] = useState("danado");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-destructive to-warning shadow-[var(--shadow-elevated)]">
              <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight text-foreground">
                PROSHITS
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Control de Novedades
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-success sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Finanzas API: Online
            </span>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <CircleUser className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">Control de Novedades</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
          Control de Novedades
        </h1>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Bandeja */}
          <aside className="lg:col-span-3">
            <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="mb-4 flex items-center gap-2">
                <Inbox className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  Bandeja de Novedades
                </h2>
              </div>

              <div className="mb-4 flex gap-1 rounded-lg bg-secondary p-1">
                {(["pendientes", "historial"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                      tab === t
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t === "pendientes" ? "Pendientes (8)" : "Historial"}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {novedades.map((n) => (
                  <button
                    key={n.id}
                    className={`w-full rounded-lg border-l-4 p-3 text-left transition-colors ${
                      n.active
                        ? "border-l-primary bg-primary/5"
                        : "border-l-transparent bg-background hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-muted-foreground">
                        ID: #{n.id}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {n.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-foreground">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{n.sub}</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${n.badge.color}`}
                    >
                      {n.badge.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </aside>

          {/* Detalle */}
          <section className="lg:col-span-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-foreground">
                  Detalles del Paquete #PH-99283
                </h2>
                <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Estado: Novedad Activa
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <Cell label="Cliente" value="TecnoCorp S.A." />
                <Cell label="Ruta" value="R-450 (CABA)" />
                <Cell label="Unidades" value="3 Bultos" />
                <Cell label="Módulo" value="MOD 2 (Ruta)" />
              </div>

              <div className="mt-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    Trazabilidad Inmutable (Blockchain Sync)
                  </h3>
                </div>

                <ol className="relative space-y-5 border-l-2 border-dashed border-border pl-6">
                  {trazabilidad.map((step) => (
                    <li key={step.hash} className="relative">
                      <span
                        className={`absolute -left-[33px] top-1 flex h-4 w-4 items-center justify-center rounded-full ${
                          step.state === "alert"
                            ? "bg-destructive"
                            : "bg-success"
                        }`}
                      >
                        {step.state === "alert" ? (
                          <XCircle className="h-3 w-3 text-destructive-foreground" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3 text-success-foreground" />
                        )}
                      </span>
                      <p
                        className={`text-sm font-bold ${
                          step.state === "alert"
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] italic text-muted-foreground">
                        {step.time} | Hash: {step.hash}
                      </p>
                      {step.state === "alert" && (
                        <p className="mt-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs italic text-foreground">
                          "Se detectó caja mojada y golpeada durante la descarga
                          en cliente final. El cliente rechaza la recepción."
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Acción */}
          <aside className="space-y-4 lg:col-span-3">
            <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-sm font-bold text-foreground">
                Registrar Acción
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Tipo de Novedad
                  </label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="danado">
                        Dañado (Requiere POD)
                      </SelectItem>
                      <SelectItem value="extraviado">Extraviado</SelectItem>
                      <SelectItem value="rechazado">
                        Rechazado por cliente
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Descripción de Resolución
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Detalle las acciones tomadas o el veredicto final..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Multimedia POD (Obligatorio)
                  </label>
                  <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed border-border bg-secondary/40 px-3 py-6 text-center hover:border-primary/50 hover:bg-primary/5">
                    <UploadCloud className="h-5 w-5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      Subir foto o video
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      PNG, JPG o MP4 (Máx 20MB)
                    </span>
                  </label>
                </div>
              </div>
            </section>

            <Button variant="outline" className="h-11 w-full">
              <Mail className="h-4 w-4" />
              Notificar a Cliente
            </Button>
            <Button className="h-12 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]">
              <CheckCircle2 className="h-5 w-5" />
              Cerrar Novedad
            </Button>

            <div className="flex gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Sincronización de Costos
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Endpoint activo para ajustes de facturación por novedad.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-8 border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-xs text-muted-foreground">
          <p>© 2024 PROSHITS S.A. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
