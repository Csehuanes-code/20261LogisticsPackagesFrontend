import { useState } from "react";
import { ChevronRight, Warehouse, AlertTriangle, LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { NoveltyForm } from "../components/novelty/NoveltyForm";
import { toast } from "sonner";

export function NoveltyReportPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    toast.loading("Registrando novedad y notificando al controlador...");
    setTimeout(() => {
      setIsSubmitting(false);
      toast.dismiss();
      toast.success("Novedad registrada con éxito.", {
        description: "El paquete ha sido movido a 'Novedad en Bodega'.",
      });
      navigate({ to: "/gestion" });
    }, 2500);
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
            Paquete: <span className="font-mono font-semibold">PRX-9823-UUID</span>
          </p>
        </div>

        <NoveltyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </main>
    </AppLayout>
  );
}
