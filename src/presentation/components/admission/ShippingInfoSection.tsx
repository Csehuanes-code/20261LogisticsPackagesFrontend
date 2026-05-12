import { useState } from "react";
import { Truck } from "lucide-react";
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
import { PaymentMethod, PaymentMethodLabel } from "@/domain/enums/payment-method.enum";

export function ShippingInfoSection() {
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);

  return (
    <FormCard
      icon={<Truck className="h-4 w-4" />}
      title="Información de Envío"
      iconBg="bg-primary/10 text-primary"
    >
      <Field
        label="Valor Declarado (USD)"
        hint={
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            Obligatorio
          </span>
        }
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
            $
          </span>
          <Input className="pl-7" placeholder="0.00" />
        </div>
      </Field>
      <Field label="Método de Pago">
        <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
          <SelectTrigger>
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
      </Field>
    </FormCard>
  );
}
