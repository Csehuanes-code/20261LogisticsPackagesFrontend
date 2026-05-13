import React from "react";
import { Link } from "@tanstack/react-router";
import { CircleUser, MapPin, Bell } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  title?: string;
  subtitle?: string;
  iconBgClass?: string;
  showFinanzas?: boolean;
}

export function AppLayout({
  children,
  icon,
  title = "HERMES EXPRESS",
  subtitle = "Logística Profesional",
  iconBgClass = "bg-gradient-to-br from-primary to-primary-glow shadow-[var(--shadow-elevated)]",
  showFinanzas = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBgClass}`}
            >
              {icon}
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight text-foreground">{title}</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {showFinanzas && (
              <span className="hidden items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-success sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Finanzas API: Online
              </span>
            )}
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sede Actual
              </p>
              <p className="flex items-center justify-end gap-1.5 text-sm font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Sede Central · ID 001
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-foreground">Operador 042</p>
                <p className="text-xs text-muted-foreground">Turno Mañana</p>
              </div>
              <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors hover:bg-secondary/80">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/80 cursor-pointer">
                <CircleUser className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-auto border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} HERMES EXPRESS S.A. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-colors">
              Soporte Técnico
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
