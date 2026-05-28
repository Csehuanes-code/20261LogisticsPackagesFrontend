import { MapPin, Building2 } from "lucide-react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, Control, UseFormSetValue } from "react-hook-form";
import { FormCard } from "../shared/FormCard";
import { Field } from "../shared/Field";
import { DocumentType, DocumentTypeLabel } from "@/domain/enums/document-type.enum";

// Ciudades y departamentos con cobertura en el sistema
const CIUDADES_COBERTURA = [
  { ciudad: "Bogotá", departamento: "Cundinamarca" },
  { ciudad: "Medellín", departamento: "Antioquia" },
  { ciudad: "Cali", departamento: "Valle del Cauca" },
  { ciudad: "Barranquilla", departamento: "Atlántico" },
  { ciudad: "Cartagena", departamento: "Bolívar" },
  { ciudad: "Bucaramanga", departamento: "Santander" },
  { ciudad: "Pereira", departamento: "Risaralda" },
  { ciudad: "Manizales", departamento: "Caldas" },
  { ciudad: "Cúcuta", departamento: "Norte de Santander" },
  { ciudad: "Ibagué", departamento: "Tolima" },
  { ciudad: "Riohacha", departamento: "La Guajira" },
];

interface RecipientFormProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
}

// Componente interno para Select de ciudades con autocompletado de departamento
function CiudadSelect({ 
  value, 
  onChange, 
  setValue
}: { 
  value: string; 
  onChange: (val: string) => void; 
  setValue: UseFormSetValue<any>;
}) {
  const handleCiudadChange = (ciudad: string) => {
    onChange(ciudad);
    // Encontrar el departamento correspondiente y actualizarlo
    const ciudadData = CIUDADES_COBERTURA.find(c => c.ciudad === ciudad);
    if (ciudadData) {
      setValue("direccionDestino.departamento", ciudadData.departamento);
    }
  };

  return (
    <Select value={value} onValueChange={handleCiudadChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona una ciudad" />
      </SelectTrigger>
      <SelectContent>
        {CIUDADES_COBERTURA.map((c) => (
          <SelectItem key={c.ciudad} value={c.ciudad}>
            {c.ciudad}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function RecipientForm({ control, setValue }: RecipientFormProps) {
  return (
    <FormCard
      icon={<MapPin className="h-4 w-4" />}
      title="Datos del Destinatario"
      iconBg="bg-accent/15 text-accent"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo de Documento">
          <Controller
            name="destinatario.tipoDocumento"
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
            name="destinatario.numeroDocumento"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input placeholder="Ej: 45678901" {...field} />
            )}
          />
        </Field>
      </div>
      <Field label="Nombre Completo">
        <Controller
          name="destinatario.nombreCompleto"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input placeholder="Nombre de quien recibe" {...field} />
          )}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono">
          <Controller
            name="destinatario.telefono"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input placeholder="312 654 3218" {...field} />
            )}
          />
        </Field>
        <Field label="Correo Electrónico">
          <Controller
            name="destinatario.correoElectronico"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input type="email" placeholder="usuario@ejemplo.com" {...field} />
            )}
          />
        </Field>
      </div>
      <Field label="Dirección de Entrega">
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Controller
            name="direccionDestino.direccion"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input className="pl-9" placeholder="Av. Principal 123" {...field} />
            )}
          />
        </div>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ciudad">
          <Controller
            name="direccionDestino.ciudad"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <CiudadSelect
                value={field.value}
                onChange={field.onChange}
                setValue={setValue}
              />
            )}
          />
        </Field>
        <Field label="Departamento">
          <Controller
            name="direccionDestino.departamento"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input 
                placeholder="Se completa automáticamente" 
                {...field}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            )}
          />
        </Field>
      </div>
    </FormCard>
  );
}
