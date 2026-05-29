import React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FieldProps {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className={`text-xs font-semibold ${error ? "text-destructive" : "text-foreground"}`}>
          {label}
        </Label>
        {hint}
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
