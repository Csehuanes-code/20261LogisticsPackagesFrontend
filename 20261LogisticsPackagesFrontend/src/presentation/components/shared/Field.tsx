import React from "react";
import { Label } from "@/components/ui/label";

interface FieldProps {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-foreground">{label}</Label>
        {hint}
      </div>
      {children}
    </div>
  );
}
