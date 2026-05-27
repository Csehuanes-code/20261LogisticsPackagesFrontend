import { useState, useEffect, useMemo } from "react";
import { Package, AlertTriangle, ArrowRight, LoaderCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { ShipmentSummary } from "../components/weighing/ShipmentSummary";
import { TechnicalSpecs } from "../components/weighing/TechnicalSpecs";
import { MerchandiseTypeSelector } from "../components/weighing/MerchandiseTypeSelector";
import { MetricsDisplay } from "../components/weighing/MetricsDisplay";
import { PriceBreakdownView } from "../components/weighing/PriceBreakdown";
import { toast } from "sonner";
import { MerchandiseType } from "@/domain/enums/merchandise-type.enum";
import { useAdmission } from "@/lib/admission-context";
import { WeighingApiService } from "@/infrastructure/http/weighing-api.service";

// Constante para cálculo de peso volumétrico
const DENSITY_FACTOR = 250;

export function WeighingPage() {
  const navigate = useNavigate();
  const { 
    paqueteId, 
    etiquetaDigital,
    remitenteNombre,
    destinatarioNombre,
    direccionDestinoTexto,
    distanciaKm
  } = useAdmission();
  
  const [merch, setMerch] = useState<MerchandiseType>(MerchandiseType.STANDARD);
  const [pesoReal, setPesoReal] = useState(0);
  const [volumen, setVolumen] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [precioEnvio, setPrecioEnvio] = useState<number | null>(null);
  const [formaIrregular, setFormaIrregular] = useState(false);
  
  // FE-3: Estados para dimensiones capturadas
  const [lengthCm, setLengthCm] = useState(0);
  const [widthCm, setWidthCm] = useState(0);
  const [heightCm, setHeightCm] = useState(0);
  
  // FE-3: Estado para alertas del backend
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [backendAlerts, setBackendAlerts] = useState<string[]>([]);
  const [showAtypicalDensityAlert, setShowAtypicalDensityAlert] = useState(false);

   // Validar que paqueteId exista (viene de AdmissionPage)
   useEffect(() => {
     if (!paqueteId) {
       toast.warning("⚠️ Sesión incompleta. Redirigiendo a admisión...");
       setTimeout(() => {
         navigate({ to: "/admision" });
       }, 1500);
     }
   }, [paqueteId, navigate]);

   if (!paqueteId) {
     return (
       <AppLayout icon={<Package className="h-5 w-5 text-primary-foreground" />} title="HERMES EXPRESS">
         <main className="mx-auto max-w-7xl px-6 py-8">
           <Alert variant="destructive">
             <AlertTriangle className="h-4 w-4" />
             <AlertTitle>Error: Paquete no encontrado</AlertTitle>
             <AlertDescription>
               Por favor regrese a la pantalla de admisión para completar el flujo.
             </AlertDescription>
           </Alert>
         </main>
       </AppLayout>
     );
   }

  const pesoVolumetrico = volumen * DENSITY_FACTOR;
  const pesoFacturable = Math.max(pesoReal, pesoVolumetrico);

  useEffect(() => {
    if (pesoReal > 0 && pesoVolumetrico > 0) {
      const diff = Math.abs(pesoReal - pesoVolumetrico);
      const percentageDiff = (diff / Math.max(pesoReal, pesoVolumetrico)) * 100;
      setShowAtypicalDensityAlert(percentageDiff > 30);
    } else {
      // Reset la alerta cuando los valores sean 0 o se borren
      setShowAtypicalDensityAlert(false);
    }
  }, [pesoReal, pesoVolumetrico]);

   // FE-3: Implementar llamada real al backend
   const handleConfirm = async () => {
     // Validar que todos los campos estén completos
     if (!pesoReal || isNaN(pesoReal) || pesoReal <= 0) {
       toast.error("❌ Por favor ingrese un peso válido");
       return;
     }
     if (!lengthCm || isNaN(lengthCm) || !widthCm || isNaN(widthCm) || !heightCm || isNaN(heightCm)) {
       toast.error("❌ Por favor complete todas las dimensiones");
       return;
     }

    setIsSubmitting(true);
     try {
       // FE-3: Llamar a WeighingApiService.weighPackage()
       const response = await WeighingApiService.weighPackage({
         paqueteId,
         peso: pesoReal,
         largoCm: lengthCm,
         anchoCm: widthCm,
         altoCm: heightCm,
         tipoMercancia: merch,
         formaIrregular: formaIrregular,
       });

      // FE-3: Capturar alertas del backend
      if (response.alertas && response.alertas.length > 0) {
        setBackendAlerts(response.alertas);
        setShowAlertsDialog(true);
        toast.warning("⚠️ Se detectaron alertas en el pesaje. Por favor revise.");
        return; // No continuar hasta que el usuario confirme
      }

       // Si no hay alertas, proceder directamente
       setPrecioEnvio(response.precioEnvio);
       toast.success(`✅ Pesaje completado. Precio: $${response.precioEnvio}`);
       setTimeout(() => {
         navigate({ to: "/gestion" });
       }, 1500);
     } catch (error: any) {
       let errorMsg = error.message || "Error desconocido";
       // Mejorar mensaje para errores de validación de peso
       if (errorMsg.includes("Peso") || errorMsg.includes("peso")) {
         errorMsg = "❌ Peso fuera de rango permitido (0.01 – 70 kg). Por favor corrija el valor.";
       }
       toast.error(errorMsg);
     } finally {
       setIsSubmitting(false);
     }
   };

  // FE-3: Confirmar después de revisar alertas
  const handleConfirmWithAlerts = async () => {
    setShowAlertsDialog(false);
    setIsSubmitting(true);
    try {
      // Reintentar con confirmación explícita
      const response = await WeighingApiService.weighPackage({
        paqueteId,
        peso: pesoReal,
        largoCm: lengthCm,
        anchoCm: widthCm,
        altoCm: heightCm,
        tipoMercancia: merch,
        formaIrregular: formaIrregular,
      });

       setPrecioEnvio(response.precioEnvio);
       toast.success(`✅ Pesaje confirmado. Precio: $${response.precioEnvio}`);
       setTimeout(() => {
         navigate({ to: "/gestion" });
       }, 1500);
     } catch (error: any) {
       let errorMsg = error.message || "Error desconocido";
       // Mejorar mensaje para errores de validación de peso
       if (errorMsg.includes("Peso") || errorMsg.includes("peso")) {
         errorMsg = "❌ Peso fuera de rango permitido (0.01 – 70 kg). Por favor corrija el valor.";
       }
       toast.error(errorMsg);
     } finally {
       setIsSubmitting(false);
     }
   };

  return (
    <AppLayout
      icon={<Package className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS"
    >
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <BreadcrumbNav items={[{ label: "Admisión", to: "/admision" }, { label: "Pesaje" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Pesaje y Dimensiones
            </h1>
           <p className="mt-1 text-sm text-muted-foreground">
             UUID: <span className="font-mono">{paqueteId}</span>
           </p>
          </div>
          {pesoFacturable > 50 && (
            <div className="flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-4 py-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Carga Especial (&gt;50kg)
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <ShipmentSummary 
              remitenteNombre={remitenteNombre}
              destinatarioNombre={destinatarioNombre}
              direccionDestino={direccionDestinoTexto}
            />
            <TechnicalSpecs 
              onDimensionsChange={setVolumen} 
              onWeightChange={setPesoReal}
              onIrregularChange={setFormaIrregular}
              onDimensionsRaw={(length, width, height) => {
                setLengthCm(length);
                setWidthCm(width);
                setHeightCm(height);
              }}
            />
            <MetricsDisplay
              volumeM3={volumen}
              volumetricWeight={pesoVolumetrico}
              billableWeight={pesoFacturable}
              hasAtypicalDensity={showAtypicalDensityAlert}
            />
            <MerchandiseTypeSelector value={merch} onChange={setMerch} />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <PriceBreakdownView 
              billableWeight={pesoFacturable}
              distanciaKm={distanciaKm}
              tipoMercancia={merch}
              cargaEspecial={pesoFacturable > 50 || volumen > 0.5}
              precioEnvio={precioEnvio} 
            />
            <div className="space-y-3">
              <Button
                size="lg"
                className="h-14 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)] transition-transform hover:scale-[1.01] hover:shadow-lg"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? "Solicitando Ruta..." : "Confirmar y Solicitar Ruta"}
              </Button>
              <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Al confirmar, el paquete se bloqueará para recolección inmediata.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FE-3: AlertDialog para mostrar alertas del backend (CARGA_ESPECIAL, DENSIDAD_ATIPICA) */}
      <AlertDialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <AlertDialogContent>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alertas Detectadas en el Pesaje
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se han detectado las siguientes alertas. Por favor revise antes de continuar.
          </AlertDialogDescription>
          <div className="space-y-1 mt-4">
            {backendAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <AlertDialogCancel onClick={() => {
              setShowAlertsDialog(false);
              setBackendAlerts([]);
            }}>Editar Datos</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmWithAlerts} disabled={isSubmitting}>
              {isSubmitting ? "Confirmando..." : "Confirmar y Continuar"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
