import { useState } from "react";
import { UploadCloud, FileCheck2, AlertTriangle, LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NoveltyFormProps {
  onSubmit: (data: { tipo: string; notas: string; evidencia: File | null }) => void;
  isSubmitting: boolean;
}

export function NoveltyForm({ onSubmit, isSubmitting }: NoveltyFormProps) {
  const [tipoNovedad, setTipoNovedad] = useState("danado");
  const [notas, setNotas] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const isSubmitDisabled = tipoNovedad === "danado" && !evidenceFile;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setEvidenceFile(e.target.files[0]);
      toast.success("Evidencia adjuntada:", { description: e.target.files[0].name });
    }
  };

  return (
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
               value={notas}
               onChange={(e) => setNotas(e.target.value)}
             />
           </div>

          {tipoNovedad === "danado" && (
            <div>
              <label className="text-xs font-semibold text-foreground">
                Evidencia (Obligatorio)
              </label>
              <label
                htmlFor="evidence-upload"
                className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
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
         className={`h-12 w-full bg-gradient-to-r from-destructive to-orange-500 text-base font-bold text-white shadow-[var(--shadow-elevated)] transition-opacity ${
           isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
         }`}
         onClick={() => onSubmit({ tipo: tipoNovedad, notas, evidencia: evidenceFile })}
         disabled={isSubmitDisabled || isSubmitting}
       >
        {isSubmitting ? (
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <AlertTriangle className="mr-2 h-5 w-5" />
        )}
        {isSubmitting ? "Enviando Reporte..." : "Confirmar Reporte de Novedad"}
      </Button>

      {isSubmitDisabled && (
        <div className="mt-3 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-destructive flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span><strong>Acción requerida:</strong> Debe adjuntar la evidencia fotográfica (foto o video) antes de confirmar el reporte de paquete dañado.</span>
          </p>
        </div>
      )}
    </div>
  );
}
