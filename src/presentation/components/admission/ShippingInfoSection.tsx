import { Truck } from "lucide-react";
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
import { PaymentMethod, PaymentMethodLabel } from "@/domain/enums/payment-method.enum";

interface ShippingInfoSectionProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
  touched?: any;
}

export function ShippingInfoSection({
  control,
  errors,
  touched,
}: ShippingInfoSectionProps) {
  return (
    <FormCard
      icon={<Truck className="h-4 w-4" />}
      title="Información de Envío"
      iconBg="bg-primary/10 text-primary"
    >
      <Field
        label="Valor Declarado (COP)"
        hint={
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            Obligatorio
          </span>
        }
        error={
          touched?.valorDeclarado
            ? typeof errors?.valorDeclarado?.message === "string"
              ? errors.valorDeclarado.message
              : undefined
            : undefined
        }
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
            $
          </span>
          <Controller
            name="valorDeclarado"
            control={control}
            defaultValue={1000}
            render={({ field }) => (
              <Input
                className={`pl-7 ${
                  touched?.valorDeclarado && errors?.valorDeclarado
                    ? "border-destructive"
                    : ""
                }`}
                placeholder="1000"
                type="number"
                {...field}
                onChange={(e) => {
                  const value = e.target.valueAsNumber;
                  field.onChange(isNaN(value) ? 0 : value);
                }}
              />
            )}
          />
        </div>
      </Field>
      <Field
        label="Método de Pago"
        error={
          touched?.metodoPago
            ? typeof errors?.metodoPago?.message === "string"
              ? errors.metodoPago.message
              : undefined
            : undefined
        }
      >
        <Controller
          name="metodoPago"
          control={control}
          defaultValue={PaymentMethod.PREPAGO}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={
                  touched?.metodoPago && errors?.metodoPago
                    ? "border-destructive"
                    : ""
                }
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PaymentMethodLabel).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>
    </FormCard>
  );
}
