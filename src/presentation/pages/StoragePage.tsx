import { useState, useEffect } from "react";
import {
  ChevronRight,
  Warehouse,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Route as RouteIcon,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { ZoneAssignmentPanel } from "../components/storage/ZoneAssignmentPanel";
import { CapacitySection } from "../components/storage/CapacitySection";
import { toast } from "sonner";
import { StorageApiService, StorageZoneSuggestionDTO } from "@/infrastructure/http/storage-api.service";
import { useAdmission } from "@/lib/admission-context";
import { useCases } from "@/lib/di";

export function StoragePage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/gestion" });
  const {
    setPaqueteId: setContextPaqueteId,
    setZonaId: setContextZonaId,
  } = useAdmission();
  const [packageId, setPackageId] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [suggestion, setSuggestion] = useState<StorageZoneSuggestionDTO | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-buscar si viene paqueteId en search params
  useEffect(() => {
    if (searchParams.paqueteId && !packageId) {
      setPackageId(searchParams.paqueteId);
    }
  }, [searchParams.paqueteId, packageId]);

  // Auto-disparar búsqueda cuando se completa el packageId desde URL
  useEffect(() => {
    if (packageId && !suggestion) {
      handleSearch();
    }
  }, [packageId, suggestion]);

  const handleSearch = async () => {
    if (!packageId.trim()) {
      toast.error("Por favor ingresa un UUID de paquete");
      return;
    }

    setLoadingSearch(true);
    setError(null);
    toast.loading("Buscando paquete...");

    try {
      const result = await StorageApiService.getStorageZoneSuggestion(packageId);
      setSuggestion(result);
      toast.dismiss();
      toast.success(`Zona sugerida: ${result.nombreZona}`);
     } catch (err: any) {
       const errorMsg = err.message || "Error al buscar el paquete";
       const errorCode = err.codigo || "";
       setError(errorMsg);
       toast.dismiss();
       toast.error(errorMsg);
     } finally {
      setLoadingSearch(false);
    }
  };

  const handleConfirm = async () => {
    if (!suggestion) {
      toast.error("Por favor busca un paquete primero");
      return;
    }

    setIsConfirming(true);
    toast.loading("Confirmando almacenaje y actualizando estado...");

    try {
      await StorageApiService.assignStorageZone(suggestion.paqueteId, suggestion.zonaId);
      toast.dismiss();
      toast.success("Paquete almacenado con éxito.", {
        description: "Redirigiendo a la pantalla de clasificación...",
      });
      
      // Navegar a clasificación con el paqueteId
      setTimeout(() => {
        navigate({ to: "/clasificacion", search: { paqueteId: suggestion.paqueteId } });
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.message || "Error al confirmar almacenaje";
      const errorCode = err.codigo || "";
      setError(errorMsg);
      toast.dismiss();
      
      // Manejo de errores específicos basado en el código
      if (errorCode === "ZONA_SATURADA") {
        toast.error("Zona saturada", {
          description: "Se debe usar una zona de contingencia. Intenta nuevamente.",
        });
      } else if (errorCode === "ZONA_NO_APTA") {
        toast.error("Zona no apta", {
          description: "La zona seleccionada no es compatible con este tipo de mercancía.",
        });
      } else if (errorCode === "CONFLICTO_CONCURRENCIA") {
        toast.error("Conflicto de concurrencia", {
          description: "Paquete ya procesado, intenta nuevamente.",
        });
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleGoToDiscrepancy = () => {
    if (!suggestion) return;
    setContextPaqueteId(suggestion.paqueteId);
    setContextZonaId(suggestion.zonaId);
    navigate({ to: "/discrepancia" });
  };

  return (
    <AppLayout
      icon={<Warehouse className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS Bodega"
      subtitle="Gestión de Ingreso"
    >
      <main className="mx-auto max-w-7xl px-6 py-8">
        <BreadcrumbNav items={[{ label: "Gestión de Ingreso" }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gestión de Ingreso y Almacenaje
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escanee o ingrese el identificador único para procesar el paquete.
          </p>
        </div>

        <section className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="relative mx-auto max-w-2xl">
            <ScanLine className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-14 rounded-xl pl-12 text-base"
              placeholder="Buscar por UUID del paquete (ej: 550e8400-e29b-41d4-a716-446655440000)"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loadingSearch}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={loadingSearch || !packageId.trim()}
              className="flex-1"
            >
              {loadingSearch ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <ScanLine className="mr-2 h-4 w-4" />
                  Buscar Paquete
                </>
              )}
            </Button>
          </div>
        </section>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestion && (
          <Alert className="mb-6 bg-primary/5 border-primary/20">
            <RouteIcon className="h-4 w-4" />
            <AlertTitle className="font-bold">Paquete Encontrado</AlertTitle>
            <AlertDescription>
              Paquete <span className="font-mono font-semibold">{suggestion.paqueteId}</span> asignado a zona{" "}
              <span className="font-mono font-semibold">{suggestion.nombreZona}</span>.
            </AlertDescription>
          </Alert>
        )}

        {suggestion && (suggestion.tipoMercancia === "FRAGIL" || suggestion.tipoMercancia === "PELIGROSO") && (
          <Alert className="mb-6 bg-amber/5 border-amber/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-bold">Alerta de Manejo Especial</AlertTitle>
            <AlertDescription>
              Este paquete contiene mercancía {suggestion.tipoMercancia === "FRAGIL" ? "frágil" : "peligrosa"} que requiere cuidado especial. Verifica que se almacene correctamente.
            </AlertDescription>
          </Alert>
        )}

        {suggestion && (
          <div className="grid gap-6 lg:grid-cols-3">
            <ZoneAssignmentPanel
              suggestedZone={suggestion.nombreZona}
              isSaturated={suggestion.zonaSaturada || false}
              zonaCategoria={suggestion.categoria}
              nombreZonaPrincipal={suggestion.nombreZonaPrincipal}
            />

            <div className="space-y-3">
              <Button
                size="lg"
                className="h-12 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]"
                onClick={handleConfirm}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                {isConfirming ? "Confirmando..." : "Confirmar Almacenaje"}
              </Button>
              <Button
                variant="outline"
                className="h-12 w-full"
                onClick={handleGoToDiscrepancy}
                disabled={!suggestion}
              >
                <FileText className="h-4 w-4" />
                Reportar Discrepancia Física
              </Button>
               <Button
                 asChild
                 variant="outline"
                 className="h-12 w-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
               >
                 <Link to="/reportar-novedad" search={{ paqueteId: suggestion.paqueteId }}>
                   <AlertTriangle className="h-4 w-4" />
                   Reportar Novedad (Daño/Extra)
                 </Link>
               </Button>

              <CapacitySection
                pesoActualKg={suggestion.pesoActualKg}
                capacidadMaxKg={suggestion.capacidadMaxKg}
                volumenActualM3={suggestion.volumenActualM3}
                capacidadMaxM3={suggestion.capacidadMaxM3}
                contadorPaquetes={suggestion.contadorPaquetes}
                capacidadMaxPaquetes={suggestion.capacidadMaxPaquetes}
              />
            </div>
          </div>
        )}

        {!suggestion && !loadingSearch && (
          <div className="rounded-2xl border-2 border-dashed border-muted-foreground/30 p-12 text-center">
            <ScanLine className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Ingresa un UUID de paquete y haz clic en "Buscar Paquete" para comenzar.
            </p>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
