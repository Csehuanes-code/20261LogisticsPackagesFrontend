import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface ModuleCardProps {
  to: "/admision" | "/gestion" | "/novedades" | "/pesaje" | "/discrepancia" | "/tracking";
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
}

export function ModuleCard({ to, icon, title, description, iconBg }: ModuleCardProps) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-[var(--shadow-elevated)] ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
        Ingresar
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
