import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  Warehouse,
  AlertTriangle,
  UploadCloud,
  FileCheck2,
  LoaderCircle,
  PackageX,
} from "lucide-react";
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
import { toast } from "sonner";

export const Route = createFileRoute("/reportar-novedad")({
  component: ReportarNovedadPage,
  head: () => ({
    meta: [
      { title: "Reportar Novedad en Bodega · PROSHITS" },
      {
        name: "description",
        content: "Registro de paquetes dañados o extraviados en bodega.",
      },
    ],
  }),
});

function ReportarNovedadPage() {
  const navigate = useNavigate();
  const [tipoNovedad, setTipoNovedad] = useState("danado");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = tipoNovedad === "danado" && !evidenceFile;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
      toast.success("Evidencia adjuntada:", { description: e.target.files[0].name });
    }
  };

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
      title="PROSHITS Bodega"
      subtitle="Gestión de Ingreso"
    >
      <main className="mx-auto max-w-2xl px-6 py-8">
        <nav className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/gestion" className="hover:text-foreground">
            Gestión de Ingreso
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">Reportar Novedad</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reportar Novedad en Bodega
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paquete: <span className="font-mono font-semibold">PRX-9823-UUID</span>
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Tipo de Novedad</label>
                <Select value={tipoNovedad} onValueChange={setTipoNovedad}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="danado">Dañado en Bodega</SelectItem>
                    <SelectItem value="extraviado">Extraviado en Bodega</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Notas Adicionales</label>
                <Textarea
                  rows={4}
                  placeholder="Describa el daño, la situación o el último lugar donde se vio el paquete..."
                />
              </div>

              {tipoNovedad === "danado" && (
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Evidencia (Obligatorio)
                  </label>
                  <label
                    htmlFor="evidence-upload"
                    className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed  p-8 text-center transition-colors ${
                      evidenceFile
                        ? "border-success/50 bg-success/5 text-success"
                        : "border-border bg-secondary/40 hover:border-primary/60 hover:bg-primary/5"
                    }`}
                  >
                    {evidenceFile ? (
                      <>
                        <FileCheck2 className="h-8 w-8" />
                        <span className="text-sm font-bold">{evidenceFile.name}</span>
                        <span className="text-xs">Archivo adjuntado. Puede cambiarlo si lo desea.</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">
                          Subir foto o video
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          La evidencia es obligatoria para paquetes dañados.
                        </span>
                      </>
                    )}
                  </label>
                  <input
                    id="evidence-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
          </section>

          <Button
            size="lg"
            className="h-12 w-full bg-gradient-to-r from-destructive to-orange-500 text-base font-bold text-white shadow-[var(--shadow-elevated)]"
            onClick={handleSubmit}
            disabled={isSubmitDisabled || isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <AlertTriangle className="mr-2 h-5 w-5" />
            )}
            {isSubmitting ? "Enviando Reporte..." : "Confirmar Reporte de Novedad"}
          </Button>
        </div>
      </main>
    </AppLayout>
  );
}
