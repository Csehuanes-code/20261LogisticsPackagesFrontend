import { User, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, Control } from "react-hook-form";
import { FormCard } from "../shared/FormCard";
import { Field } from "../shared/Field";
import { DocumentType, DocumentTypeLabel } from "@/domain/enums/document-type.enum";

interface SenderFormProps {
  control: Control<any>;
}

export function SenderForm({ control }: SenderFormProps) {
  return (
    <FormCard
      icon={<User className="h-4 w-4" />}
      title="Datos del Remitente"
      iconBg="bg-primary/10 text-primary"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo de Documento">
          <Controller
            name="remitente.tipoDocumento"
            control={control}
            defaultValue={DocumentType.CEDULA_CIUDADANIA}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DocumentType.CEDULA_CIUDADANIA}>{DocumentTypeLabel[DocumentType.CEDULA_CIUDADANIA]}</SelectItem>
                  <SelectItem value={DocumentType.CEDULA_EXTRANJERIA}>{DocumentTypeLabel[DocumentType.CEDULA_EXTRANJERIA]}</SelectItem>
                  <SelectItem value={DocumentType.PASAPORTE}>{DocumentTypeLabel[DocumentType.PASAPORTE]}</SelectItem>
                  <SelectItem value={DocumentType.NIT}>{DocumentTypeLabel[DocumentType.NIT]}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Número de Documento">
          <Controller
            name="remitente.numeroDocumento"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input placeholder="Ej: 70654321" {...field} />
            )}
          />
        </Field>
      </div>
      <Field label="Nombre Completo / Razón Social">
        <Controller
          name="remitente.nombreCompleto"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input placeholder="Ingrese nombre completo" {...field} />
          )}
        />
      </Field>
      <Field label="Teléfono de Contacto">
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Controller
            name="remitente.telefono"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input className="pl-9" placeholder="999 999 999" {...field} />
            )}
          />
        </div>
      </Field>
    </FormCard>
  );
}
