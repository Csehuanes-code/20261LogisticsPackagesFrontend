import { useState } from "react";
import { User, Phone } from "lucide-react";
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

export function SenderForm() {
  const [docType, setDocType] = useState(DocumentType.DNI);

  return (
    <FormCard
      icon={<User className="h-4 w-4" />}
      title="Datos del Remitente"
      iconBg="bg-primary/10 text-primary"
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
              <SelectItem value={DocumentType.PASSPORT}>Pasaporte</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Número de Documento">
          <Input placeholder="Ej: 70654321" />
        </Field>
      </div>
      <Field label="Nombre Completo / Razón Social">
        <Input placeholder="Ingrese nombre completo" />
      </Field>
      <Field label="Teléfono de Contacto">
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="999 999 999" />
        </div>
      </Field>
    </FormCard>
  );
}
