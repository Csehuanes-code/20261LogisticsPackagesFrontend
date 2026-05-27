import { useState } from "react";
import { MapPin, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field } from "../shared/Field";
import { toast } from "sonner";
import { AdmisionApiService } from "@/infrastructure/http/admission-api.service";

export interface CoverageMapProps {
  /** Estado del GPS: PENDIENTE (requiere entrada manual), RESUELTO (GPS exitoso) o null */
  estadoGps?: "PENDIENTE" | "RESUELTO" | null;
  /** ID del paquete para enviar coordenadas actualizadas */
  paqueteId?: string;
  /** Callback cuando se actualizan las coordenadas exitosamente */
  onCoordinatesUpdate?: (latitud: number, longitud: number) => void;
}

export function CoverageMap({ 
  estadoGps = null, 
  paqueteId, 
  onCoordinatesUpdate 
}: CoverageMapProps) {
  const [manualLat, setManualLat] = useState<string>("");
  const [manualLon, setManualLon] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveCoordinates = async () => {
    // Validar que existan valores
    if (!manualLat || !manualLon) {
      toast.error("Por favor ingrese latitud y longitud");
      return;
    }

    // Validar que sean números válidos
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

    if (isNaN(lat) || isNaN(lon)) {
      toast.error("Ingrese valores numéricos válidos");
      return;
    }

    // Validar rangos
    if (lat < -90 || lat > 90) {
      toast.error("La latitud debe estar entre -90 y 90");
      return;
    }

    if (lon < -180 || lon > 180) {
      toast.error("La longitud debe estar entre -180 y 180");
      return;
    }

    // Validar que tengamos el paqueteId
    if (!paqueteId) {
      toast.error("Error: ID del paquete no disponible");
      return;
    }

    setIsSubmitting(true);
    try {
      // Llamar al endpoint PATCH de coordenadas
      await AdmisionApiService.updateCoordenadas(paqueteId, lat, lon);
      
      toast.success("✅ Coordenadas guardadas. GPS resuelto.");
      
      // Invocar callback si está disponible
      onCoordinatesUpdate?.(lat, lon);
      
      // Limpiar inputs
      setManualLat("");
      setManualLon("");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si GPS fue resuelto correctamente, mostrar estado exitoso
  if (estadoGps === "RESUELTO") {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/15 text-success">
              <MapPin className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-foreground">Cobertura Geográfica</h2>
          </div>
          <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
            GPS Resuelto
          </span>
        </div>
        <div className="relative h-56 overflow-hidden bg-[var(--gradient-map)]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(1 0 0 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute left-0 right-0 top-1/3 h-1 -rotate-6 bg-card/60" />
          <div className="absolute bottom-1/3 left-0 right-0 h-1 rotate-3 bg-card/60" />
          <div className="relative flex h-full flex-col items-center justify-center gap-3">
            <div className="relative">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/40" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-success to-success/80 shadow-[var(--shadow-elevated)]">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
              <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-success" />
              Destino validado correctamente
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si GPS está PENDIENTE, mostrar panel de entrada manual
  if (estadoGps === "PENDIENTE") {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/15 text-destructive">
              <MapPin className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-foreground">Cobertura Geográfica</h2>
          </div>
          <span className="rounded-full bg-destructive/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive">
            Fallo de GPS
          </span>
        </div>
        <div className="p-5">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Geolocalización Pendiente</AlertTitle>
            <AlertDescription>
              El servicio de localización no pudo validar la dirección. Por favor ingrese las coordenadas manualmente.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Latitud (-90 a 90)">
              <Input 
                placeholder="Ej: -12.046374"
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                disabled={isSubmitting}
              />
            </Field>
            <Field label="Longitud (-180 a 180)">
              <Input 
                placeholder="Ej: -77.042793"
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                value={manualLon}
                onChange={(e) => setManualLon(e.target.value)}
                disabled={isSubmitting}
              />
            </Field>
          </div>
          <Button
            onClick={handleSaveCoordinates}
            disabled={isSubmitting || !manualLat || !manualLon}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando coordenadas...
              </>
            ) : (
              "Guardar Coordenadas"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Si estadoGps es null o no está definido, mostrar placeholder neutro
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <MapPin className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-foreground">Cobertura Geográfica</h2>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Sin definir
        </span>
      </div>
      <div className="relative h-56 overflow-hidden bg-muted/20">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p className="text-sm">Esperando información de geolocalización...</p>
        </div>
      </div>
    </div>
  );
}
