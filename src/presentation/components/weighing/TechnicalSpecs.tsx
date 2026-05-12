import { useState } from "react";
import { Ruler, PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TechnicalSpecsProps {
  onDimensionsChange: (volumeM3: number) => void;
  onWeightChange: (kg: number) => void;
}

export function TechnicalSpecs({ onDimensionsChange, onWeightChange }: TechnicalSpecsProps) {
  const [irregular, setIrregular] = useState(false);

  const handleDimensionChange = () => {};

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent">
            <Ruler className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-foreground">Especificaciones Técnicas</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="irregular-switch" className="text-xs font-bold text-muted-foreground">
            Forma Irregular
          </Label>
          <Switch id="irregular-switch" checked={irregular} onCheckedChange={setIrregular} />
        </div>
      </div>

      {irregular && (
        <Alert variant="default" className="mb-4 flex items-center gap-3">
          <PackageSearch className="h-5 w-5 text-primary" />
          <div>
            <AlertTitle className="font-bold">Modo de Medición Irregular</AlertTitle>
            <AlertDescription className="text-xs">
              Mida el paquete usando las dimensiones de la caja contenedora mínima imaginaria que lo
              envuelve.
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
            <Input placeholder="00" type="number" />
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Peso Real (kg)
        </label>
        <div className="relative">
          <Input
            placeholder="0.00"
            type="number"
            className="pr-12"
            onChange={(e) => onWeightChange(e.target.valueAsNumber)}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
            kg
          </span>
        </div>
        <p className="text-[11px] italic text-muted-foreground">Rango permitido: 0.01 - 70.00 kg</p>
      </div>
    </section>
  );
}
