import { Box, Wine, ShieldAlert } from "lucide-react";
import { MerchandiseType, MerchandiseTypeLabel } from "@/domain/enums/merchandise-type.enum";

interface MerchandiseTypeSelectorProps {
  value: MerchandiseType;
  onChange: (type: MerchandiseType) => void;
}

const typeIcons: Record<MerchandiseType, typeof Box> = {
  [MerchandiseType.STANDARD]: Box,
  [MerchandiseType.FRAGILE]: Wine,
  [MerchandiseType.DANGEROUS]: ShieldAlert,
};

export function MerchandiseTypeSelector({ value, onChange }: MerchandiseTypeSelectorProps) {
  return (
    <div className="mt-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Tipo de Mercancía
      </p>
      <div className="grid grid-cols-3 gap-3">
        {Object.values(MerchandiseType).map((type) => {
          const Icon = typeIcons[type];
          const active = value === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                active
                  ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
                  : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {MerchandiseTypeLabel[type]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
