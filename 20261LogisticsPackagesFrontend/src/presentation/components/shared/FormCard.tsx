import React from "react";

interface FormCardProps {
  icon: React.ReactNode;
  title: string;
  iconBg?: string;
  children: React.ReactNode;
}

export function FormCard({
  icon,
  title,
  iconBg = "bg-primary/10 text-primary",
  children,
}: FormCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center gap-2.5">
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${iconBg}`}>
          {icon}
        </span>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
