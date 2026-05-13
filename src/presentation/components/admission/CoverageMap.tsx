import { useState } from "react";
import { MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field } from "../shared/Field";

export function CoverageMap() {
  const [gpsError, setGpsError] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent">
            <MapPin className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-foreground">Cobertura Geográfica</h2>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            gpsError ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
          }`}
        >
          {gpsError ? "FALLO DE GPS" : "Dentro de rango"}
        </span>
      </div>

      {gpsError ? (
        <div className="p-5">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Fallo en API de Geolocalización</AlertTitle>
            <AlertDescription>
              El servicio de Google Maps no respondió. Ingrese las coordenadas manualmente.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitud">
              <Input placeholder="Ej: -12.046374" />
            </Field>
            <Field label="Longitud">
              <Input placeholder="Ej: -77.042793" />
            </Field>
          </div>
        </div>
      ) : (
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
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-warning shadow-[var(--shadow-elevated)]">
                <MapPin className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
            <p className="rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
              <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-success" />
              Destino validado correctamente
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-end gap-2 border-t border-border bg-card/50 px-5 py-3">
        <Label htmlFor="gps-error-switch" className="text-xs font-bold text-muted-foreground">
          Simular Fallo de GPS
        </Label>
        <Switch id="gps-error-switch" checked={gpsError} onCheckedChange={setGpsError} />
      </div>
    </div>
  );
}
