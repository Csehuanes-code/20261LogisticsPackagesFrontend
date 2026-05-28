import { useState, useEffect } from "react";
import { Package, Truck, Info, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { SenderForm } from "../components/admission/SenderForm";
import { RecipientForm } from "../components/admission/RecipientForm";
import { CoverageMap } from "../components/admission/CoverageMap";
import { ShippingInfoSection } from "../components/admission/ShippingInfoSection";
import { useAdmission } from "@/lib/admission-context";
import { AdmisionApiService } from "@/infrastructure/http/admission-api.service";
import { SedesApiService, SedeDTO } from "@/infrastructure/http/sedes-api.service";
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
    setSedeNombre,
    setRemitenteNombre,
    setDestinatarioNombre,
    setDireccionDestinoTexto,
    setDistanciaKm,
    setTarifaBase,
    setTarifaPorKg,
    setTarifaPorKm,
    estadoGps, 
    paqueteId 
  } = useAdmission();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sedes, setSedes] = useState<SedeDTO[]>([]);
  const [loadingSedes, setLoadingSedes] = useState(true);
  const [selectedSedeId, setSelectedSedeId] = useState<string>("");

  // FT-1: Cargar sedes disponibles al montar el componente
  useEffect(() => {
    const cargarSedes = async () => {
      try {
        const sedesData = await SedesApiService.obtenerSedes();
        setSedes(sedesData);
        setLoadingSedes(false);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
        toast.error("No se pudieron cargar las sedes disponibles");
        setLoadingSedes(false);
      }
    };
    cargarSedes();
  }, []);

  // FE-2: Configurar formulario con react-hook-form
  const { handleSubmit, control, register, setValue } = useForm({
    defaultValues: {
      sedeId: "", // FE-4: Será actualizado por setValue cuando el usuario seleccione una sede
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
              {/* FT-1: Selector de Sedes */}
              {!loadingSedes && sedes.length > 0 && (
                <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                  <div className="mb-5 flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                      📍
                    </span>
                    <h2 className="text-sm font-bold text-foreground">Sede de Origen</h2>
                  </div>
                   <Select value={selectedSedeId} onValueChange={(sedeId) => {
                      setSelectedSedeId(sedeId);
                      // Actualizar el valor en el formulario react-hook-form
                      setValue("sedeId", sedeId);
                      // Guardar tarifas de la sede seleccionada en el contexto
                      const sedeSeleccionada = sedes.find(s => s.id === sedeId);
                      if (sedeSeleccionada) {
                        setSedeNombre(sedeSeleccionada.nombre);
                        setTarifaBase(sedeSeleccionada.tarifaBase);
                        setTarifaPorKg(sedeSeleccionada.tarifaPorKg);
                        setTarifaPorKm(sedeSeleccionada.tarifaPorKm);
                      }
                    }}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {sedes.map((sede) => (
                        <SelectItem key={sede.id} value={sede.id}>
                          {sede.nombre} {sede.ciudad && `(${sede.ciudad})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </section>
              )}
              <SenderForm control={control as any} />
              <RecipientForm control={control as any} setValue={setValue as any} />
            </div>
            <div className="space-y-6 lg:col-span-2">
              {/* FE-5: Pasar props reales de GPS al CoverageMap (contingencia GPS) */}
              <CoverageMap 
                estadoGps={estadoGps ?? undefined}
                paqueteId={paqueteId ?? undefined}
                onCoordinatesUpdate={(lat, lon) => {
                  // Callback: Cuando se actualizan las coordenadas manualmente
                  setEstadoGps("RESUELTO");
                  // Navegar automáticamente a pesaje tras resolver GPS manualmente
                  setTimeout(() => {
                    navigate({ to: "/pesaje" });
                  }, 1500);
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
