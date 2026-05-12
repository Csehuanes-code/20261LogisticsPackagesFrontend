import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package,
  ChevronRight,
  AlertTriangle,
  Box,
  CheckCircle2,
  UploadCloud,
  ShieldCheck,
  Info,
  X,
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
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/discrepancia")({
  component: DiscrepanciaPage,
  head: () => ({
    meta: [
      { title: "Reportar Discrepancia Física · HERMES EXPRESS" },
      {
        name: "description",
        content:
          "Corrección de discrepancias físicas detectadas en pesaje y dimensiones — HERMES EXPRESS.",
      },
    ],
  }),
});

function DiscrepanciaPage() {
  const [motivo, setMotivo] = useState("error-pesaje");

  return (
    <AppLayout 
      icon={<Package className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS"
      showFinanzas={true}
    >
      <main className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/gestion" className="hover:text-foreground">
            Gestión de Ingreso
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">Reportar Discrepancia</span>
        </nav>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight text-foreground">
              Corregir Discrepancia Física
              <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-warning">
                <AlertTriangle className="h-3.5 w-3.5" />
                Discrepancia Detectada
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              MOD1-UC-004 · Actualización directa de datos por discrepancia
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left + middle: 2 cols */}
          <div className="space-y-6 lg:col-span-2">
            {/* Datos del paquete */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Box className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-bold text-foreground">
                  Datos del Paquete
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="UUID">
                  <p className="font-mono text-sm font-semibold text-foreground">
                    PRX-9823-UUID
                  </p>
                </Field>
                <Field label="Status">
                  <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    Recibido en Sede
                  </span>
                </Field>
                <Field label="Cliente">
                  <p className="text-sm font-semibold text-foreground">
                    TecnoSolutions S.A.
                  </p>
                </Field>
              </div>
            </section>

            {/* Original vs Corregido */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Original */}
              <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h3 className="mb-4 text-base font-bold text-foreground">
                  Original (Sistema)
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Peso Registrado
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                      52.4
                      <span className="ml-1 text-sm font-medium text-muted-foreground">
                        kg
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Dimensiones Registradas
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                      100 × 80 × 60
                      <span className="ml-1 text-sm font-medium text-muted-foreground">
                        cm
                      </span>
                    </p>
                    <p className="text-[11px] italic text-muted-foreground">
                      Largo × Ancho × Alto
                    </p>
                  </div>
                </div>
              </section>

              {/* Corregido */}
              <section className="rounded-xl bg-gradient-to-br from-primary to-primary-glow p-6 text-primary-foreground shadow-[var(--shadow-elevated)]">
                <h3 className="mb-4 text-base font-bold">Campos Corregidos</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      Peso Real
                    </p>
                    <div className="relative mt-1">
                      <Input
                        defaultValue="45.8"
                        className="h-11 border-white/30 bg-white/10 pr-10 text-base font-bold text-primary-foreground placeholder:text-primary-foreground/60"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold opacity-80">
                        kg
                      </span>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-warning/30 px-2 py-1 text-[11px] font-bold text-primary-foreground">
                      <AlertTriangle className="h-3 w-3" />
                      Diferencia: -6.6 kg
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      Dimensiones Reales (L × A × H)
                    </p>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      {["95", "75", "55"].map((v, i) => (
                        <Input
                          key={i}
                          defaultValue={v}
                          className="h-11 border-white/30 bg-white/10 text-center text-base font-bold text-primary-foreground"
                        />
                      ))}
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-warning/30 px-2 py-1 text-[11px] font-bold text-primary-foreground">
                      <AlertTriangle className="h-3 w-3" />
                      Diferencia: -5 × -5 × -5 cm
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Detalles */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="mb-5 text-base font-bold text-foreground">
                Detalles de Discrepancia
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Motivo
                  </label>
                  <Select value={motivo} onValueChange={setMotivo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error-pesaje">
                        Error en pesaje
                      </SelectItem>
                      <SelectItem value="error-dimensiones">
                        Error en dimensiones
                      </SelectItem>
                      <SelectItem value="empaque-modificado">
                        Empaque modificado
                      </SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Notas Adicionales
                  </label>
                  <Textarea
                    rows={5}
                    placeholder="Describa los hallazgos detalladamente..."
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Evidencia */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="mb-4 text-base font-bold text-foreground">
                Evidencia
              </h3>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/40 px-4 py-10 text-center transition-colors hover:border-primary/60 hover:bg-primary/5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Subir evidencia
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Fotos o videos de la discrepancia (Max 10MB)
                </span>
              </label>
            </section>

            {/* Resumen */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="mb-4 text-base font-bold text-foreground">
                Resumen
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-foreground">Actualizar el peso</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-foreground">
                    Recalibrar las métricas de almacenamiento para la Zona A-14
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <span className="text-foreground">
                    Aviso de recálculo de precios para la facturación del cliente.
                  </span>
                </li>
              </ul>
            </section>

            <div className="space-y-3">
              <Button
                size="lg"
                className="h-12 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)] hover:shadow-lg"
              >
                Confirmar Corrección
              </Button>
              <Button asChild variant="outline" className="h-11 w-full">
                <Link to="/gestion">
                  <X className="h-4 w-4" />
                  Cancelar
                </Link>
              </Button>
            </div>

            <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold text-foreground">
                  Auditoría del sistema
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Todos los cambios se registran para garantizar la calidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-2 text-[11px] italic text-muted-foreground">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          La confirmación de la corrección dispara recálculo de precios
          automáticamente.
        </div>
      </main>
    </AppLayout>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
