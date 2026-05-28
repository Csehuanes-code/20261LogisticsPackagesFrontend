import { useState, useEffect } from "react";
import {
  Package,
  Loader2,
  MapPin,
  User,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Search,
} from "lucide-react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrackingApiService, TrackingPaqueteDTO } from "@/infrastructure/http/tracking-api.service";
import { toast } from "sonner";

const estadoColores: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  RECIBIDO_EN_SEDE: { bg: "bg-blue/10", text: "text-blue", icon: <Package className="h-5 w-5" /> },
  EN_CLASIFICACION: { bg: "bg-amber/10", text: "text-amber", icon: <Clock className="h-5 w-5" /> },
  LISTO_PARA_DESPACHO: { bg: "bg-indigo/10", text: "text-indigo", icon: <FileText className="h-5 w-5" /> },
  EN_TRANSITO: { bg: "bg-cyan/10", text: "text-cyan", icon: <Truck className="h-5 w-5" /> },
  EN_PARADA_DE_ENTREGA: { bg: "bg-purple/10", text: "text-purple", icon: <MapPin className="h-5 w-5" /> },
  ENTREGADO: { bg: "bg-success/10", text: "text-success", icon: <CheckCircle className="h-5 w-5" /> },
  NOVEDAD_EN_BODEGA: { bg: "bg-warning/10", text: "text-warning", icon: <AlertCircle className="h-5 w-5" /> },
  DEVOLUCION_EN_RUTA: { bg: "bg-orange/10", text: "text-orange", icon: <Truck className="h-5 w-5" /> },
  EXTRAVIADO_EN_RUTA: { bg: "bg-destructive/10", text: "text-destructive", icon: <AlertCircle className="h-5 w-5" /> },
  DAÑADO_EN_RUTA: { bg: "bg-destructive/10", text: "text-destructive", icon: <AlertCircle className="h-5 w-5" /> },
};

export function TrackingPage() {
  const navigate = useNavigate();
  const { paqueteId } = useSearch({ from: "/tracking" });
  
  const [tracking, setTracking] = useState<TrackingPaqueteDTO | null>(null);
  const [isLoading, setIsLoading] = useState(paqueteId ? true : false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    if (!paqueteId) {
      setIsLoading(false);
      return;
    }

    const cargarTracking = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await TrackingApiService.obtenerTracking(paqueteId);
        setTracking(data);
      } catch (err: any) {
        const mensaje = err.mensaje || err.message || "Error al cargar el tracking";
        setError(mensaje);
        toast.error("Error", { description: mensaje });
      } finally {
        setIsLoading(false);
      }
    };

    cargarTracking();
  }, [paqueteId]);

  // Función para buscar un paquete
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error("Por favor ingresa un UUID válido");
      return;
    }
    navigate({ to: "/tracking", search: { paqueteId: searchInput } });
  };

  if (isLoading) {
    return (
      <AppLayout icon={<Truck className="h-5 w-5 text-primary-foreground" />} title="HERMES EXPRESS">
        <main className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Cargando tracking...</span>
        </main>
      </AppLayout>
    );
  }

  // Si no hay paqueteId, mostrar formulario de búsqueda
  if (!paqueteId) {
    return (
      <AppLayout icon={<Truck className="h-5 w-5 text-primary-foreground" />} title="HERMES EXPRESS">
        <main className="mx-auto max-w-7xl px-6 py-8">
          <BreadcrumbNav items={[{ label: "Seguimiento de Paquetes" }]} />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Seguimiento de Paquete
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ingresa el UUID del paquete para consultar su estado y historial
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">UUID del Paquete</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Ej: 550e8400-e29b-41d4-a716-446655440000"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Buscar Paquete
              </Button>
            </form>
          </div>

          <div className="mt-8 flex justify-center">
            <Button onClick={() => navigate({ to: "/" })} variant="outline">
              Volver al inicio
            </Button>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (error || !tracking) {
    return (
      <AppLayout icon={<Truck className="h-5 w-5 text-primary-foreground" />} title="HERMES EXPRESS">
        <main className="mx-auto max-w-7xl px-6 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Paquete no encontrado"}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate({ to: "/" })} className="mt-4">
            Volver al inicio
          </Button>
        </main>
      </AppLayout>
    );
  }

  const estadoActual = estadoColores[tracking.estado] || estadoColores.RECIBIDO_EN_SEDE;

  return (
    <AppLayout icon={<Truck className="h-5 w-5 text-primary-foreground" />} title="HERMES EXPRESS">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <BreadcrumbNav items={[{ label: "Tracking de Paquetes" }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Seguimiento del Paquete
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Etiqueta: <span className="font-mono font-semibold">{tracking.etiquetaDigital}</span>
          </p>
        </div>

        {/* Header: Estado actual */}
        <div className={`mb-6 rounded-xl border p-6 ${estadoActual.bg}`}>
          <div className="flex items-center gap-3">
            <div className={`${estadoActual.text}`}>{estadoActual.icon}</div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Estado Actual</p>
              <p className={`text-2xl font-bold ${estadoActual.text}`}>
                {tracking.estado.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Datos del envío */}
          <div className="lg:col-span-2 space-y-6">
            {/* Remitente y Destinatario */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-base font-bold text-foreground">Detalles del Envío</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Remitente</p>
                  <p className="mt-1 text-foreground">{tracking.remitenteNombre || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Destinatario</p>
                  <p className="mt-1 text-foreground">{tracking.destinatarioNombre || "N/A"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold text-muted-foreground">Dirección de Destino</p>
                  <p className="mt-1 text-foreground">
                    {tracking.ciudadDestino}, {tracking.departamentoDestino}
                  </p>
                </div>
                {tracking.distanciaEstimadaKm != null && tracking.distanciaEstimadaKm > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Distancia Estimada</p>
                    <p className="mt-1 text-foreground">{tracking.distanciaEstimadaKm} km</p>
                  </div>
                )}
                {tracking.rutaId && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Ruta Asignada</p>
                    <p className="mt-1 font-mono text-sm text-foreground">{tracking.rutaId}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Timeline */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-base font-bold text-foreground">Historial de Transiciones</h2>
              <div className="space-y-4">
                {tracking.historial.length > 0 ? (
                  tracking.historial.map((item, idx) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        {idx < tracking.historial.length - 1 && (
                          <div className="h-12 w-0.5 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold text-foreground">
                          {item.estadoNuevo.replace(/_/g, " ")}
                        </p>
                        {item.observaciones && (
                          <p className="mt-1 text-sm text-muted-foreground">{item.observaciones}</p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(item.fechaTransicionUtc).toLocaleString("es-CO")}
                        </p>
                        {item.urlEvidencia && (
                          <a href={item.urlEvidencia} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                            Ver evidencia
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Sin historial disponible</p>
                )}
              </div>
            </section>

            {/* Evidencia de entrega */}
            {tracking.fechaEntregaUtc && (
              <section className="rounded-xl border border-success/20 bg-success/5 p-6">
                <h2 className="mb-4 text-base font-bold text-foreground">Confirmación de Entrega</h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Entregado a:</span> {tracking.nombreFirmante || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Fecha:</span> {new Date(tracking.fechaEntregaUtc).toLocaleString("es-CO")}
                  </p>
                  {tracking.urlEvidenciaEntrega && (
                    <a href={tracking.urlEvidenciaEntrega} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                      Ver prueba de entrega
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Resumen lateral */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="text-xs font-bold uppercase text-muted-foreground">ID del Paquete</p>
              <p className="mt-2 font-mono text-sm break-all">{tracking.paqueteId}</p>
            </div>
            
            <Button onClick={() => navigate({ to: "/" })} variant="outline" className="w-full">
              Volver al Inicio
            </Button>
          </aside>
        </div>
      </main>
    </AppLayout>
  );
}
