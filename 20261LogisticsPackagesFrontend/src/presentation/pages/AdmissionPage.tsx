import { useState, useEffect } from "react";
import { Package, Truck, Info, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { SenderForm } from "../components/admission/SenderForm";
import { RecipientForm } from "../components/admission/RecipientForm";
import { CoverageMap } from "../components/admission/CoverageMap";
import { ShippingInfoSection } from "../components/admission/ShippingInfoSection";
import { useAdmission } from "@/lib/admission-context";
import { AdmisionApiService } from "@/infrastructure/http/admission-api.service";
import { SedeApiService, type SedeResponseDto } from "@/infrastructure/http/sede-api.service";
import { DocumentType } from "@/domain/enums/document-type.enum";
import { PaymentMethod } from "@/domain/enums/payment-method.enum";

export function AdmissionPage() {
  const navigate = useNavigate();
  const { 
    setPaqueteId, 
    setEtiquetaDigital, 
    setEstadoGps, 
    setEstado,
    setSedeId,
    setRemitenteNombre,
    setDestinatarioNombre,
    setDireccionDestinoTexto,
    setDistanciaKm,
    estadoGps, 
    paqueteId 
  } = useAdmission();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sedes, setSedes] = useState<SedeResponseDto[]>([]);
  const [sedesLoading, setSedesLoading] = useState(true);
  const [sedesError, setSedesError] = useState(false);

  // FE-3.3: Cargar sedes disponibles al montar el componente
  useEffect(() => {
    const cargarSedes = async () => {
      try {
        setSedesLoading(true);
        setSedesError(false);
        const sedesData = await SedeApiService.listarSedes();
        setSedes(sedesData);
        
        // Si no hay sedes, mostrar un error
        if (sedesData.length === 0) {
          toast.error("No hay sedes disponibles en el sistema");
        }
      } catch (error: any) {
        console.error("Error al cargar sedes:", error);
        setSedesError(true);
        toast.error("Error al cargar las sedes disponibles");
      } finally {
        setSedesLoading(false);
      }
    };
    
    cargarSedes();
  }, []);

  // FE-2: Configurar formulario con react-hook-form
  const { handleSubmit, control, register, watch } = useForm({
    defaultValues: {
      sedeId: "",
      remitente: {
        tipoDocumento: DocumentType.CEDULA_CIUDADANIA,
        numeroDocumento: "",
        nombreCompleto: "",
        telefono: "",
      },
      destinatario: {
        tipoDocumento: DocumentType.CEDULA_CIUDADANIA,
        numeroDocumento: "",
        nombreCompleto: "",
        telefono: "",
        correoElectronico: "",
      },
      direccionDestino: {
        direccion: "",
        ciudad: "",
        departamento: "",
        pais: "COLOMBIA",
      },
      valorDeclarado: 0,
      metodoPago: PaymentMethod.PREPAGO,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // FE-2: Llamar al backend con AdmisionApiService - payload 100% dinámico
      const response = await AdmisionApiService.registerAdmision(data);

      // Guardar respuesta en contexto
      setPaqueteId(response.paqueteId);
      setEtiquetaDigital(response.etiquetaDigital);
      setEstadoGps(response.estadoGps);
      setEstado(response.estado);
      setSedeId(data.sedeId);
      
      // Guardar nombres del remitente y destinatario para mostrar en pesaje
      setRemitenteNombre(data.remitente.nombreCompleto);
      setDestinatarioNombre(data.destinatario.nombreCompleto);
      setDireccionDestinoTexto(`${data.direccionDestino.ciudad}, ${data.direccionDestino.departamento}`);
      
      // Guardar distancia estimada para cálculo de precio dinámico en pesaje
      if (response.distanciaEstimadaKm) {
        setDistanciaKm(response.distanciaEstimadaKm);
      }

      // FE-2: Validar estado GPS para decidir flujo
      if (response.estadoGps === "PENDIENTE") {
        toast.info("📍 Geolocalización pendiente. Por favor ingrese coordenadas manualmente.");
      } else if (response.estadoGps === "RESUELTO") {
        toast.success("✅ Admisión registrada. Continuando al pesaje...");
        // Redirigir automáticamente a pesaje
        setTimeout(() => {
          navigate({ to: "/pesaje" });
        }, 1000);
      }
    } catch (error: any) {
      if (error.message.includes("COBERTURA_INVALIDA")) {
        toast.error("❌ Dirección fuera de cobertura. Por favor verifique los datos de entrega.");
      } else {
        toast.error(`Error al registrar: ${error.message}`);
      }
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
            <BreadcrumbNav items={[{ label: "Admisión" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Admisión de Paquete
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Registro de nuevo envío
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-4 py-2 text-sm font-semibold text-foreground">
            <span className="flex h-2 w-2 rounded-full bg-warning shadow-[0_0_0_4px_oklch(0.72_0.17_65/0.2)]" />
            Paso 1: Datos Generales
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
              <SenderForm control={control as any} />
              <RecipientForm control={control as any} />
            </div>
             <div className="space-y-6 lg:col-span-2">
                {/* FE-3.3: Selector dinámico de sedes */}
                {sedesLoading ? (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                    <p className="text-sm text-muted-foreground">Cargando sedes...</p>
                  </div>
                ) : sedesError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error de conexión</AlertTitle>
                    <AlertDescription>
                      No se pudo cargar las sedes. Verifique la conexión e intente nuevamente.
                    </AlertDescription>
                  </Alert>
                ) : sedes.length === 0 ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Sin sedes disponibles</AlertTitle>
                    <AlertDescription>
                      No hay sedes disponibles en el sistema. Por favor contacte al administrador.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Sede de Operación</label>
                    <Controller
                      name="sedeId"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Seleccione una sede de operación...</option>
                          {sedes.map((sede) => (
                            <option key={sede.id} value={sede.id}>
                              {sede.nombre} ({sede.ciudad}, {sede.departamento})
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      Seleccione la sede desde donde se despachará el paquete
                    </p>
                  </div>
                )}
                
                {/* FE-5: Pasar props reales de GPS al CoverageMap (contingencia GPS) */}
                <CoverageMap 
                  estadoGps={estadoGps ?? undefined}
                  paqueteId={paqueteId ?? undefined}
                  onCoordinatesUpdate={(lat, lon) => {
                    // Callback: Cuando se actualizan las coordenadas manualmente
                    setEstadoGps("RESUELTO");
                    // Navegar automáticamente a pesaje después de actualizar GPS
                    toast.success("📍 Coordenadas guardadas. Continuando al pesaje...");
                    setTimeout(() => {
                      navigate({ to: "/pesaje" });
                    }, 1000);
                  }}
                />
               <ShippingInfoSection control={control as any} />
              <div className="space-y-3">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-14 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)] transition-transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      Continuar al Pesaje
                      <Truck className="ml-1 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
           </div>
         </form>

        <Alert className="mt-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Recordatorio para el Operador</AlertTitle>
          <AlertDescription>
            Al confirmar el registro y asignarse la ruta, informe al cliente que la fecha estimada
            máxima de entrega es de **7 días hábiles**.
          </AlertDescription>
        </Alert>
      </main>
    </AppLayout>
  );
}
