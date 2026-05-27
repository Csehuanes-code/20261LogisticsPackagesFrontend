import { useState } from "react";
import { Warehouse } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { NoveltyForm } from "../components/novelty/NoveltyForm";
import { useNovelty } from "../hooks/use-novelty";
import { useAuth } from "@/lib/auth-context";
import { NoveltyType } from "@/domain/enums/novelty-type.enum";
import { NoveltyOrigin } from "@/domain/enums/novelty-origin.enum";
import { toast } from "sonner";
import { parseApiError } from "@/infrastructure/api/http-client";

export function NoveltyReportPage() {
  const navigate = useNavigate();
  const { report } = useNovelty();
  const { user } = useAuth();
  const { paqueteId: paqueteIdFromSearch } = useSearch({ from: "/reportar-novedad" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener paqueteId desde los search params (viene de StoragePage con el paquete real)
  const paqueteId = paqueteIdFromSearch ?? null;

  // UUID del usuario autenticado (viene del AuthUser desde el contexto de autenticación)
  const usuarioId = user?.userId ?? null;

  const handleSubmit = async (data: { tipo: string; notas: string; evidencia: File | null }) => {
    if (!paqueteId) {
      toast.error("Error: No se pudo identificar el paquete.");
      return;
    }

    if (!usuarioId) {
      toast.error("Error de autenticación", {
        description: "No se pudo identificar al usuario. Inicia sesión nuevamente.",
      });
      return;
    }

    setIsSubmitting(true);
    toast.loading("Registrando novedad y notificando al controlador...");

    try {
      // Mapear el tipo de novedad del formulario (danado/extraviado) a NoveltyType enum
      const tipoMap: Record<string, NoveltyType> = {
        danado: NoveltyType.DAMAGED,
        extraviado: NoveltyType.LOST,
      };
      const tipoNovedad = tipoMap[data.tipo] || NoveltyType.DAMAGED;

      // Construir el input para el caso de uso
      const input = {
        packageId: paqueteId,
        type: tipoNovedad,
        title: `Novedad: ${tipoNovedad}`,
        description: data.notas || undefined,
        origin: NoveltyOrigin.WAREHOUSE,
        reportedBy: usuarioId, // UUID real extraído del JWT token
        evidence: data.evidencia ? data.evidencia.name : undefined,
        evidenceFile: data.evidencia || undefined, // Pasar el File real
      };

      // Llamar al caso de uso (el archivo se maneja en el repositorio/adaptador)
      await report(input);

      setIsSubmitting(false);
      toast.dismiss();
      toast.success("Novedad registrada con éxito.", {
        description: "El paquete ha sido movido a 'Novedad en Bodega'.",
      });
      navigate({ to: "/gestion" });
    } catch (error) {
      setIsSubmitting(false);
      toast.dismiss();
      const apiError = parseApiError(error);
      toast.error("Error al registrar novedad", {
        description: apiError.mensaje || "Por favor intente nuevamente.",
      });
      console.error("Error en reportar novedad:", error);
    }
  };

  return (
    <AppLayout
      icon={<Warehouse className="h-5 w-5 text-primary-foreground" />}
      title="HERMES EXPRESS Bodega"
      subtitle="Gestión de Ingreso"
    >
      <main className="mx-auto max-w-2xl px-6 py-8">
        <BreadcrumbNav
          items={[{ label: "Gestión de Ingreso", to: "/gestion" }, { label: "Reportar Novedad" }]}
        />

       <div className="mb-8">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
           Reportar Novedad en Bodega
         </h1>
         <p className="mt-1 text-sm text-muted-foreground">
           Paquete: <span className="font-mono font-semibold">{paqueteId}</span>
         </p>
       </div>

        <NoveltyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </main>
    </AppLayout>
  );
}
