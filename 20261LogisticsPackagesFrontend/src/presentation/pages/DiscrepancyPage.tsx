import { useMemo, useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  Box,
  CheckCircle2,
  ShieldCheck,
  Info,
  X,
  LoaderCircle,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
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
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { Field } from "../components/shared/Field";
import { useAdmission } from "@/lib/admission-context";
import { useDiscrepancy } from "@/presentation/hooks/use-discrepancy";
import { DiscrepancyApiService } from "@/infrastructure/http/discrepancy-api.service";

export function DiscrepancyPage() {
  const navigate = useNavigate();
  const {
    paqueteId,
    etiquetaDigital,
    zonaId,
    remitenteNombre: contextRemitenteNombre,
  } = useAdmission();
  const {
    formData,
    isSubmitting,
    updateField,
    calculateDifferences,
    submitDiscrepancy,
  } = useDiscrepancy();

  // Estado local para los datos del paquete
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [pesoOriginal, setPesoOriginal] = useState<number | null>(null);
  const [largoOriginal, setLargoOriginal] = useState<number | null>(null);
  const [anchoOriginal, setAnchoOriginal] = useState<number | null>(null);
  const [altoOriginal, setAltoOriginal] = useState<number | null>(null);
  const [remitenteNombre, setRemitenteNombre] = useState<string | null>(contextRemitenteNombre);

  // Cargar datos del paquete al montarse
  useEffect(() => {
    if (!paqueteId) return;

    const loadPackageData = async () => {
      setIsLoadingData(true);
      try {
        const packageData = await DiscrepancyApiService.getPackageDetails(paqueteId);
        
        if (packageData) {
          if (packageData.pesoKg) {
            setPesoOriginal(packageData.pesoKg);
          }
          if (packageData.largoCm && packageData.anchoCm && packageData.altoCm) {
            setLargoOriginal(packageData.largoCm);
            setAnchoOriginal(packageData.anchoCm);
            setAltoOriginal(packageData.altoCm);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos del paquete:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadPackageData();
  }, [paqueteId]);

  // Calcular diferencias dinámicamente
  const differences = useMemo(
    () =>
      calculateDifferences(
        pesoOriginal ?? undefined,
        largoOriginal ?? undefined,
        anchoOriginal ?? undefined,
        altoOriginal ?? undefined
      ),
    [
      formData.pesoCorregido,
      formData.largoCorregido,
      formData.anchoCorregido,
      formData.altoCorregido,
      pesoOriginal,
      largoOriginal,
      anchoOriginal,
      altoOriginal,
      calculateDifferences,
    ]
  );

  // Determinar qué cambió para mostrar en el Resumen
  const cambiosDetectados = useMemo(() => {
    const cambios: string[] = [];
    if (
      formData.pesoCorregido > 0 &&
      formData.pesoCorregido !== pesoOriginal
    ) {
      cambios.push(`Actualizar el peso (${pesoOriginal} kg → ${formData.pesoCorregido} kg)`);
    }
    if (
      formData.largoCorregido > 0 &&
      (formData.largoCorregido !== largoOriginal ||
        formData.anchoCorregido !== anchoOriginal ||
        formData.altoCorregido !== altoOriginal)
    ) {
      cambios.push(
        `Actualizar dimensiones (${largoOriginal}×${anchoOriginal}×${altoOriginal} cm → ${formData.largoCorregido}×${formData.anchoCorregido}×${formData.altoCorregido} cm)`
      );
    }
    if (cambios.length > 0) {
      cambios.push("Recalibrar las métricas de almacenamiento");
      cambios.push("Aviso de recálculo de precios para facturación del cliente");
    }
    return cambios;
  }, [formData, pesoOriginal, largoOriginal, anchoOriginal, altoOriginal]);

  const handleConfirm = async () => {
    if (!paqueteId) {
      alert("Error: paqueteId no encontrado");
      return;
    }

    const success = await submitDiscrepancy(paqueteId);
    if (success) {
      setTimeout(() => {
        navigate({ to: "/gestion", search: { paqueteId } });
      }, 1500);
    }
  };

  // Validar que paqueteId exista
  if (!paqueteId) {
    return (
      <AppLayout
        icon={<Package className="h-5 w-5 text-primary-foreground" />}
        title="HERMES EXPRESS"
      >
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            <p className="font-semibold">Error: Paquete no encontrado</p>
            <p className="text-sm">Por favor regrese a la pantalla de gestión.</p>
          </div>
          <Button onClick={() => navigate({ to: "/gestion" })} className="mt-4">
            Volver a Gestión
          </Button>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      icon={<Package className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS"
    >
      <main className="mx-auto max-w-7xl px-6 py-8">
        <BreadcrumbNav
          items={[
            { label: "Gestión de Ingreso", to: "/gestion" },
            { label: "Reportar Discrepancia" },
          ]}
        />

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
              Actualización directa de datos por discrepancia
            </p>
          </div>
        </div>

        {isLoadingData && (
          <div className="mb-6 flex items-center justify-center rounded-xl border border-border bg-card p-8">
            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Cargando datos del paquete...</span>
          </div>
        )}

        {!isLoadingData && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {/* Datos del Paquete */}
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
                      {paqueteId}
                    </p>
                  </Field>
                  <Field label="Status">
                    <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      Recibido en Sede
                    </span>
                  </Field>
                  <Field label="Cliente">
                    <p className="text-sm font-semibold text-foreground">
                      {remitenteNombre || "Cliente"}
                    </p>
                  </Field>
                </div>
              </section>

              {/* Comparación Original vs Corregido */}
              <div className="grid gap-6 md:grid-cols-2">
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
                        {pesoOriginal !== null ? pesoOriginal : "N/A"}
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
                        {largoOriginal !== null && anchoOriginal !== null && altoOriginal !== null
                          ? `${largoOriginal} × ${anchoOriginal} × ${altoOriginal}`
                          : "N/A"}
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

                <section className="rounded-xl bg-gradient-to-br from-primary to-primary-glow p-6 text-primary-foreground shadow-[var(--shadow-elevated)]">
                  <h3 className="mb-4 text-base font-bold">Campos Corregidos</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                        Peso Real
                      </p>
                      <div className="relative mt-1">
                        <Input
                          type="number"
                          value={formData.pesoCorregido || ""}
                          onChange={(e) =>
                            updateField("pesoCorregido", parseFloat(e.target.value) || 0)
                          }
                          placeholder="Ingrese peso real"
                          className="h-11 border-white/30 bg-white/10 pr-10 text-base font-bold text-primary-foreground placeholder:text-primary-foreground/60"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold opacity-80">
                          kg
                        </span>
                      </div>
                      {differences.pesoDiff !== null && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-warning/30 px-2 py-1 text-[11px] font-bold text-primary-foreground">
                          <AlertTriangle className="h-3 w-3" />
                          Diferencia:{" "}
                          {differences.pesoDiff > 0 ? "+" : ""}
                          {differences.pesoDiff.toFixed(1)} kg
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                        Dimensiones Reales (L × A × H)
                      </p>
                      <div className="mt-1 grid grid-cols-3 gap-2">
                        <Input
                          type="number"
                          value={formData.largoCorregido || ""}
                          onChange={(e) =>
                            updateField("largoCorregido", parseFloat(e.target.value) || 0)
                          }
                          placeholder="Largo"
                          className="h-11 border-white/30 bg-white/10 text-center text-base font-bold text-primary-foreground"
                        />
                        <Input
                          type="number"
                          value={formData.anchoCorregido || ""}
                          onChange={(e) =>
                            updateField("anchoCorregido", parseFloat(e.target.value) || 0)
                          }
                          placeholder="Ancho"
                          className="h-11 border-white/30 bg-white/10 text-center text-base font-bold text-primary-foreground"
                        />
                        <Input
                          type="number"
                          value={formData.altoCorregido || ""}
                          onChange={(e) =>
                            updateField("altoCorregido", parseFloat(e.target.value) || 0)
                          }
                          placeholder="Alto"
                          className="h-11 border-white/30 bg-white/10 text-center text-base font-bold text-primary-foreground"
                        />
                      </div>
                      {differences.largoDiff !== null &&
                        differences.anchoDiff !== null &&
                        differences.altoDiff !== null && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-warning/30 px-2 py-1 text-[11px] font-bold text-primary-foreground">
                            <AlertTriangle className="h-3 w-3" />
                            Diferencia:{" "}
                            {differences.largoDiff > 0 ? "+" : ""}
                            {differences.largoDiff.toFixed(0)} ×{" "}
                            {differences.anchoDiff > 0 ? "+" : ""}
                            {differences.anchoDiff.toFixed(0)} ×{" "}
                            {differences.altoDiff > 0 ? "+" : ""}
                            {differences.altoDiff.toFixed(0)} cm
                          </span>
                        )}
                    </div>
                  </div>
                </section>
              </div>

            </div>

            {/* Panel Lateral: Resumen */}
            <div className="space-y-6">
              <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h3 className="mb-4 text-base font-bold text-foreground">
                  Resumen
                </h3>
                {cambiosDetectados.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                    {cambiosDetectados.map((cambio, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-foreground">{cambio}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Ingrese los datos corregidos para ver el resumen de cambios.
                  </p>
                )}
              </section>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="h-12 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)] hover:shadow-lg disabled:opacity-50"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar Corrección"
                  )}
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
        )}
      </main>
    </AppLayout>
  );
}
