import { useState, useEffect } from "react";
import { ChevronRight, Warehouse, CheckCircle2, Compass, Truck, LoaderCircle, AlertCircle } from "lucide-react";
import { Link, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { PackageInfoCard } from "../components/classification/PackageInfoCard";
import { DestinationZoneList } from "../components/classification/DestinationZoneList";
import { toast } from "sonner";
import { StorageApiService, ClassificationSuggestionDTO } from "@/infrastructure/http/storage-api.service";

export function ClassificationPage() {
  const search = useSearch({ from: "/clasificacion" });
  // search ya está tipado por validateSearch de la ruta
  const paqueteId = (search as Record<string, any>).paqueteId as string | undefined;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<ClassificationSuggestionDTO | null>(null);
  const [availableZones, setAvailableZones] = useState<any[]>([]);

  useEffect(() => {
    // Cargar zonas disponibles
    const loadZones = async () => {
      try {
        const zones = await StorageApiService.getDestinationZones();
        if (zones) {
          setAvailableZones(zones);
        }
      } catch (err) {
        console.warn("No se pudieron cargar las zonas disponibles", err);
        // Usar zonas vacías como fallback
        setAvailableZones([]);
      }
    };
    loadZones();
  }, []);

  useEffect(() => {
    if (!paqueteId) {
      setError("No se especificó el ID del paquete");
      toast.error("Falta el ID del paquete", {
        description: "Por favor vuelve a la pantalla de almacenaje para seleccionar un paquete.",
      });
      return;
    }

    const loadSuggestion = async () => {
      setIsLoading(true);
      setError(null);
      toast.loading("Cargando sugerencia de zona...");

      try {
        const result = await StorageApiService.getClassificationSuggestion(paqueteId);
        setSuggestion(result);
        toast.dismiss();
        toast.success(`Zona sugerida: ${result.nombreZona}`);
      } catch (err: any) {
        const errorMsg = err.message || "Error al cargar la sugerencia";
        setError(errorMsg);
        toast.dismiss();
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestion();
  }, [paqueteId]);

  const handleConfirm = async () => {
    if (!suggestion) {
      toast.error("No hay zona sugerida disponible");
      return;
    }
    
    if (!paqueteId) {
      toast.error("ID del paquete no disponible");
      return;
    }

    setIsConfirming(true);
    toast.loading("Confirmando clasificación y actualizando estado...");

    try {
      await StorageApiService.confirmClassification(paqueteId, suggestion.zonaDestinoId);
      
      toast.dismiss();
      toast.success("Paquete clasificado y listo para despacho.", {
        description: "El estado del paquete ha sido actualizado a 'Listo para Despacho'.",
      });
      
      setIsConfirmed(true);
     } catch (err: any) {
       const errorMsg = err.message || "Error al confirmar clasificación";
       const errorCode = err.codigo || "";
       setError(errorMsg);
       toast.dismiss();
       
       // Manejo de errores específicos basado en el código
       if (errorCode === "ZONA_NO_APTA") {
         toast.error("Zona no apta", {
           description: "La zona seleccionada no es compatible con este tipo de mercancía.",
         });
       } else if (errorCode === "ZONA_DESTINO_SATURADA") {
         toast.error("Zona saturada", {
           description: "La zona de destino ha alcanzado su capacidad máxima.",
         });
       } else {
         toast.error(errorMsg);
       }
     } finally {
      setIsConfirming(false);
    }
  };

  if (!paqueteId) {
    return (
      <AppLayout
        icon={<Warehouse className="h-5 w-5 text-primary-foreground" />}
        title="HERMES EXPRESS Bodega"
        subtitle="Clasificación de Paquetes"
      >
        <main className="mx-auto max-w-4xl px-6 py-8">
          <BreadcrumbNav
            items={[{ label: "Gestión de Ingreso", to: "/gestion" }, { label: "Clasificación" }]}
          />
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error: Paquete No Especificado</AlertTitle>
            <AlertDescription>
              Por favor vuelve a la pantalla de almacenaje para seleccionar un paquete.
            </AlertDescription>
          </Alert>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      icon={<Warehouse className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS Bodega"
      subtitle="Clasificación de Paquetes"
    >
      <main className="mx-auto max-w-4xl px-6 py-8">
        <BreadcrumbNav
          items={[{ label: "Gestión de Ingreso", to: "/" }, { label: "Clasificación" }]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Clasificación por Zona de Destino
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paquete: <span className="font-mono font-semibold">{paqueteId}</span>
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert className="mb-6">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <AlertTitle>Cargando</AlertTitle>
            <AlertDescription>Obteniendo sugerencia de zona...</AlertDescription>
          </Alert>
        )}

        {isConfirmed && (
          <Alert className="mb-6 border-success/30 bg-success/5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle className="font-bold">Proceso Completado</AlertTitle>
            <AlertDescription>
              Este paquete ya fue clasificado. Puede escanear un nuevo paquete en la pantalla de
              Gestión.
            </AlertDescription>
          </Alert>
        )}

        {suggestion && !isLoading && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <PackageInfoCard
                type="Paquete en Clasificación"
                destination={suggestion.ciudadDestino || "Desconocida"}
                highlight
              />
              <section className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                    <Compass className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Zona de Destino Sugerida
                    </p>
                    <p className="text-lg font-bold text-foreground">{suggestion.nombreZona}</p>
                    <p className="text-xs text-muted-foreground">
                      Código: {suggestion.codigoZona} | Calculado por proximidad geográfica del destino.
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={isConfirming || isConfirmed} 
                    onClick={handleConfirm}
                  >
                    {isConfirming ? (
                      <>
                        <LoaderCircle className="mr-2 h-3 w-3 animate-spin" />
                        Aceptando...
                      </>
                    ) : (
                      "Aceptar"
                    )}
                  </Button>
                </div>
              </section>
            </div>
            <DestinationZoneList 
              zones={availableZones}
              suggestedZoneId={suggestion.zonaDestinoId}
              confirmed={isConfirmed}
            />
          </div>
        )}

        {suggestion && !isLoading && (
          <div className="mt-8 flex justify-end">
            <Button
              size="lg"
              className="h-12 bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]"
              onClick={handleConfirm}
              disabled={isConfirming || isConfirmed}
            >
              {isConfirming ? (
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Truck className="mr-2 h-5 w-5" />
              )}
              {isConfirming
                ? "Confirmando..."
                : isConfirmed
                  ? "Clasificación Completa"
                  : "Confirmar y Mover a Despacho"}
            </Button>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
