import { Mail, CheckCircle2, ShieldCheck, AlertTriangle, LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Novelty } from "@/domain/entities/novelty.entity";
import { NoveltyType } from "@/domain/enums/novelty-type.enum";

interface ActionPanelProps {
  novelty: Novelty;
  isClosed: boolean;
  isNotifying: boolean;
  isClosing: boolean;
  onNotify: () => void;
  onClose: () => void;
  onReclassify: () => void;
}

export function ActionPanel({
  novelty,
  isClosed,
  isNotifying,
  isClosing,
  onNotify,
  onClose,
  onReclassify,
}: ActionPanelProps) {
  if (isClosed) {
    return (
      <Alert variant="success">
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle className="font-bold">Novedad Cerrada</AlertTitle>
        <AlertDescription className="text-xs">
          Este caso fue resuelto y la información ya fue expuesta al Módulo de Finanzas.
        </AlertDescription>
      </Alert>
    );
  }

  switch (novelty.type) {
    case NoveltyType.DAMAGED:
    case NoveltyType.LOST:
      return (
        <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-sm font-bold text-foreground">Registrar Acción de Cierre</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Notas de Resolución</label>
              <Textarea rows={6} placeholder="Añadir veredicto final o acciones tomadas..." />
            </div>
            <Button
              variant="outline"
              className="h-11 w-full"
              onClick={onNotify}
              disabled={isNotifying}
            >
              {isNotifying ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              {isNotifying ? "Enviando..." : "Notificar a Cliente"}
            </Button>
            <Button
              className="h-12 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]"
              onClick={onClose}
              disabled={isClosing}
            >
              {isClosing ? (
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-5 w-5" />
              )}
              {isClosing ? "Cerrando..." : "Cerrar Novedad"}
            </Button>
          </div>
        </section>
      );
    case NoveltyType.RETURNED:
      return (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Paquete Devuelto a Bodega</AlertTitle>
          <AlertDescription>
            El paquete debe ser re-procesado. Confirme para enviarlo de nuevo a clasificación.
          </AlertDescription>
          <Button className="mt-4 w-full" onClick={onReclassify}>
            Re-clasificar Paquete
          </Button>
        </Alert>
      );
    default:
      return null;
  }
}
