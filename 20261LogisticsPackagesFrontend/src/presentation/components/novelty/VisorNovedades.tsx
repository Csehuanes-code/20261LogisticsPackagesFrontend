import { useEffect, useState } from "react";
import { Clock, AlertCircle, FileText, Link as LinkIcon, Loader } from "lucide-react";
import { HistorialEstado } from "@/domain/entities/historial-estado.entity";
import { noveltyHistoryApiService } from "@/infrastructure/http/novelty-history-api.service";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VisorNovedadesProps {
  paqueteId: string;
}

/**
 * Componente que visualiza el historial inmutable de transiciones de estado de un paquete.
 * MOD1-UC-007: T718 - Consumo del endpoint GET /api/paquetes/{id}/historial
 * 
 * Funcionalidades:
 * - Carga automática del historial desde el backend
 * - Timeline cronológico de transiciones
 * - Muestra de evidencia y novedades
 * - Manejo de estados de carga y error
 */
export function VisorNovedades({ paqueteId }: VisorNovedadesProps) {
  const [historial, setHistorial] = useState<HistorialEstado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarHistorial = async () => {
      setLoading(true);
      setError(null);

      try {
        const datos = await noveltyHistoryApiService.fetchHistorialByPaqueteId(
          paqueteId
        );
        setHistorial(datos);
      } catch (err) {
        console.error("Error al cargar historial:", err);
        setError(
          "No se pudo cargar el historial del paquete. Intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [paqueteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-5 w-5 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Cargando historial...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
        <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          Aún no hay registros de transición para este paquete.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">
          Historial de Transiciones ({historial.length})
        </h3>
      </div>

      <ol className="relative space-y-6 border-l-2 border-dashed border-border pl-6">
        {historial.map((registro, index) => (
          <li key={registro.id} className="relative">
            {/* Indicador cronológico */}
            <span className="absolute -left-[33px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <span className="h-2 w-2 rounded-full bg-primary-foreground" />
            </span>

            {/* Contenido del registro */}
            <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
              {/* Encabezado: Transición y timestamp */}
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {registro.estadoAnterior}
                    <span className="mx-2 text-muted-foreground">→</span>
                    {registro.estadoNuevo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(registro.fechaTransicionUtc).toLocaleString("es-CO", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>

                {/* Badge de novedad si aplica */}
                {registro.esNovedad && (
                  <span className="inline-flex w-fit rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-semibold uppercase text-destructive">
                    {registro.tipoNovedad}
                  </span>
                )}
              </div>

              {/* Observaciones */}
              {registro.observaciones && (
                <div className="mb-3 rounded-md bg-background/50 p-3">
                  <p className="flex items-start gap-2 text-sm text-foreground">
                    <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-0.5" />
                    <span>{registro.observaciones}</span>
                  </p>
                </div>
              )}

              {/* Evidencia si existe */}
              {registro.tieneEvidencia && registro.urlEvidencia && (
                <div className="mb-3 flex items-center gap-2 rounded-md border border-border/30 bg-background/50 p-3">
                  <LinkIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <a
                    href={registro.urlEvidencia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary hover:underline break-all"
                  >
                    Ver evidencia
                  </a>
                </div>
              )}

              {/* Metadatos: usuario y ID */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-mono">ID: {registro.id.substring(0, 8)}...</span>
                <span>•</span>
                <span>Usuario: {registro.usuarioId.substring(0, 8)}...</span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Nota explicativa */}
      <div className="mt-6 rounded-md bg-info/10 p-3 text-xs text-info-foreground">
        <p>
          <strong>Nota:</strong> Este historial es inmutable y registra todas las
          transiciones de estado del paquete desde su ingreso hasta el presente. Cada
          registro está vinculado a un UUID único y preserva la trazabilidad completa.
        </p>
      </div>
    </div>
  );
}
