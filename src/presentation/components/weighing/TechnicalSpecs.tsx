import { useState, useCallback, useMemo, useEffect } from "react";
import { Ruler, PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TechnicalSpecsProps {
  onDimensionsChange: (volumeM3: number) => void;
  onWeightChange: (kg: number) => void;
  onIrregularChange?: (irregular: boolean) => void;
  onDimensionsRaw?: (length: number, width: number, height: number) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export function TechnicalSpecs({
  onDimensionsChange,
  onWeightChange,
  onIrregularChange,
  onDimensionsRaw,
  onValidityChange,
}: TechnicalSpecsProps) {
  const [irregular, setIrregular] = useState(false);
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);

  // Estados de touch para mostrar errores solo después de onBlur
  const [touchedLength, setTouchedLength] = useState(false);
  const [touchedWidth, setTouchedWidth] = useState(false);
  const [touchedHeight, setTouchedHeight] = useState(false);
  const [touchedWeight, setTouchedWeight] = useState(false);

  // Validar que todos los campos sean válidos
  const isValid = useMemo(() => {
    const isLengthValid = length > 0;
    const isWidthValid = width > 0;
    const isHeightValid = height > 0;
    const isWeightValid = weight >= 0.01 && weight <= 70;

    return isLengthValid && isWidthValid && isHeightValid && isWeightValid;
  }, [length, width, height, weight]);

  // Notificar al padre cuando la validez cambie
  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const updateDimensions = useCallback(
    (newLength: number, newWidth: number, newHeight: number) => {
      // Si cualquier dimensión es 0 o menor, resetear volumen a 0
      if (newLength <= 0 || newWidth <= 0 || newHeight <= 0) {
        onDimensionsChange(0);
        onDimensionsRaw?.(newLength, newWidth, newHeight);
      } else {
        // Calcular volumen solo si todas las dimensiones son positivas
        const volumeM3 = (newLength * newWidth * newHeight) / 1_000_000;
        onDimensionsChange(volumeM3);
        onDimensionsRaw?.(newLength, newWidth, newHeight);
      }
    },
    [onDimensionsChange, onDimensionsRaw]
  );

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const newLength =
      value === "" ? 0 : isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    setLength(newLength);
    updateDimensions(newLength, width, height);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const newWidth =
      value === "" ? 0 : isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    setWidth(newWidth);
    updateDimensions(length, newWidth, height);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const newHeight =
      value === "" ? 0 : isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    setHeight(newHeight);
    updateDimensions(length, width, newHeight);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    const newWeight = isNaN(value) ? 0 : value;
    setWeight(newWeight);
    onWeightChange(newWeight);
  };

  // Mensajes de error personalizados
  const getLengthError = () => {
    if (!touchedLength) return undefined;
    if (length <= 0) return "Largo debe ser mayor a 0 cm";
    return undefined;
  };

  const getWidthError = () => {
    if (!touchedWidth) return undefined;
    if (width <= 0) return "Ancho debe ser mayor a 0 cm";
    return undefined;
  };

  const getHeightError = () => {
    if (!touchedHeight) return undefined;
    if (height <= 0) return "Alto debe ser mayor a 0 cm";
    return undefined;
  };

  const getWeightError = () => {
    if (!touchedWeight) return undefined;
    if (weight === 0) return "Peso debe ser ingresado";
    if (weight < 0.01) return "Peso mínimo: 0.01 kg";
    if (weight > 70) return "Peso máximo: 70 kg (excede límite)";
    return undefined;
  };

  return (
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
          <Label
            htmlFor="irregular-switch"
            className="text-xs font-bold text-muted-foreground"
          >
            Forma Irregular
          </Label>
          <Switch
            id="irregular-switch"
            checked={irregular}
            onCheckedChange={(checked) => {
              setIrregular(checked);
              onIrregularChange?.(checked);
            }}
          />
        </div>
      </div>

      {irregular && (
        <Alert variant="default" className="mb-4 flex items-center gap-3">
          <PackageSearch className="h-5 w-5 text-primary" />
          <div>
            <AlertTitle className="font-bold">
              Modo de Medición Irregular
            </AlertTitle>
            <AlertDescription className="text-xs">
              Mida el paquete usando las dimensiones de la caja contenedora
              mínima imaginaria que lo envuelve.
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Largo (cm)
          </label>
          <Input
            placeholder="00"
            type="number"
            value={length || ""}
            onChange={handleLengthChange}
            onBlur={() => setTouchedLength(true)}
            className={
              getLengthError() ? "border-destructive" : ""
            }
          />
          {getLengthError() && (
            <p className="text-xs text-destructive font-medium">
              {getLengthError()}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Ancho (cm)
          </label>
          <Input
            placeholder="00"
            type="number"
            value={width || ""}
            onChange={handleWidthChange}
            onBlur={() => setTouchedWidth(true)}
            className={
              getWidthError() ? "border-destructive" : ""
            }
          />
          {getWidthError() && (
            <p className="text-xs text-destructive font-medium">
              {getWidthError()}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Alto (cm)
          </label>
          <Input
            placeholder="00"
            type="number"
            value={height || ""}
            onChange={handleHeightChange}
            onBlur={() => setTouchedHeight(true)}
            className={
              getHeightError() ? "border-destructive" : ""
            }
          />
          {getHeightError() && (
            <p className="text-xs text-destructive font-medium">
              {getHeightError()}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Peso Real (kg)
        </label>
        <div className="relative">
          <Input
            placeholder="0.00"
            type="number"
            value={weight || ""}
            onChange={handleWeightChange}
            onBlur={() => setTouchedWeight(true)}
            className={`pr-12 ${getWeightError() ? "border-destructive" : ""}`}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
            kg
          </span>
        </div>
        {getWeightError() && (
          <p className="text-xs text-destructive font-medium">
            {getWeightError()}
          </p>
        )}
        <p className="text-[11px] italic text-muted-foreground">
          Rango permitido: 0.01 - 70.00 kg
        </p>
      </div>
    </section>
  );
}
