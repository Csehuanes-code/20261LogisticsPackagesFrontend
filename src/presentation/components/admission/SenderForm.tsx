import { User, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { FormCard } from "../shared/FormCard";
import { Field } from "../shared/Field";
import { DocumentType, DocumentTypeLabel } from "@/domain/enums/document-type.enum";

interface SenderFormProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
  touched?: any;
}

export function SenderForm({ control, errors, touched }: SenderFormProps) {
  return (
    <FormCard
      icon={<User className="h-4 w-4" />}
      title="Datos del Remitente"
      iconBg="bg-primary/10 text-primary"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Tipo de Documento"
          error={
            touched?.remitente?.tipoDocumento
              ? errors?.remitente?.tipoDocumento?.message
              : undefined
          }
        >
          <Controller
            name="remitente.tipoDocumento"
            control={control}
            defaultValue={DocumentType.CEDULA_CIUDADANIA}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={
                    touched?.remitente?.tipoDocumento &&
                    errors?.remitente?.tipoDocumento
                      ? "border-destructive"
                      : ""
                  }
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DocumentType.CEDULA_CIUDADANIA}>
                    {DocumentTypeLabel[DocumentType.CEDULA_CIUDADANIA]}
                  </SelectItem>
                  <SelectItem value={DocumentType.CEDULA_EXTRANJERIA}>
                    {DocumentTypeLabel[DocumentType.CEDULA_EXTRANJERIA]}
                  </SelectItem>
                  <SelectItem value={DocumentType.PASAPORTE}>
                    {DocumentTypeLabel[DocumentType.PASAPORTE]}
                  </SelectItem>
                  <SelectItem value={DocumentType.NIT}>
                    {DocumentTypeLabel[DocumentType.NIT]}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field
          label="Número de Documento"
          error={
            touched?.remitente?.numeroDocumento
              ? errors?.remitente?.numeroDocumento?.message
              : undefined
          }
        >
          <Controller
            name="remitente.numeroDocumento"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                placeholder="Ej: 70654321"
                {...field}
                className={
                  touched?.remitente?.numeroDocumento &&
                  errors?.remitente?.numeroDocumento
                    ? "border-destructive"
                    : ""
                }
              />
            )}
          />
        </Field>
      </div>
      <Field
        label="Nombre Completo"
        error={
          touched?.remitente?.nombreCompleto
            ? errors?.remitente?.nombreCompleto?.message
            : undefined
        }
      >
        <Controller
          name="remitente.nombreCompleto"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              placeholder="Ingrese nombre completo"
              {...field}
              className={
                touched?.remitente?.nombreCompleto &&
                errors?.remitente?.nombreCompleto
                  ? "border-destructive"
                  : ""
              }
            />
          )}
        />
      </Field>
      <Field
        label="Teléfono"
        error={
          touched?.remitente?.telefono
            ? errors?.remitente?.telefono?.message
            : undefined
        }
      >
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Controller
            name="remitente.telefono"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                className={`pl-9 ${
                  touched?.remitente?.telefono && errors?.remitente?.telefono
                    ? "border-destructive"
                    : ""
                }`}
                placeholder="301 557 4519"
                {...field}
              />
            )}
          />
        </div>
      </Field>
    </FormCard>
  );
}
