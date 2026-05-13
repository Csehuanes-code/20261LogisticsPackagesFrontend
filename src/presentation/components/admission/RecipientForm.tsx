import { useState } from "react";
import { MapPin, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormCard } from "../shared/FormCard";
import { Field } from "../shared/Field";
import { DocumentType } from "@/domain/enums/document-type.enum";

export function RecipientForm() {
  const [docType, setDocType] = useState(DocumentType.DNI);

  return (
    <FormCard
      icon={<MapPin className="h-4 w-4" />}
      title="Datos del Destinatario"
      iconBg="bg-accent/15 text-accent"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo de Documento">
          <Select value={docType} onValueChange={(v) => setDocType(v as DocumentType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DocumentType.DNI}>DNI - Documento Nacional</SelectItem>
              <SelectItem value={DocumentType.RUC}>RUC</SelectItem>
              <SelectItem value={DocumentType.CE}>Carnet de Extranjería</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Número de Documento">
          <Input placeholder="Ej: 45678901" />
        </Field>
      </div>
      <Field label="Nombre Completo">
        <Input placeholder="Nombre de quien recibe" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono">
          <Input placeholder="987 654 321" />
        </Field>
        <Field label="Correo Electrónico">
          <Input type="email" placeholder="usuario@ejemplo.com" />
        </Field>
      </div>
      <Field label="Dirección de Entrega">
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Av. Principal 123, Distrito, Ciudad" />
        </div>
      </Field>
    </FormCard>
  );
}
