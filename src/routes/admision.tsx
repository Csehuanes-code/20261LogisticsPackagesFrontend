import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package,
  User,
  MapPin,
  Truck,
  Phone,
  ChevronRight,
  CircleUser,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admision")({
  component: AdmissionPage,
  head: () => ({
    meta: [
      { title: "Admisión de Paquete · PROSHITS" },
      {
        name: "description",
        content:
          "Registro y admisión de paquetes — sistema logístico profesional PROSHITS para envíos nacionales.",
      },
    ],
  }),
});

function AdmissionPage() {
  const [senderDocType, setSenderDocType] = useState("dni");
  const [receiverDocType, setReceiverDocType] = useState("dni");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-[var(--shadow-elevated)]">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight text-foreground">
                PROSHITS
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Logística Profesional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sede Actual
              </p>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Sede Central · ID 001
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-foreground">
                  Operador 042
                </p>
                <p className="text-xs text-muted-foreground">Turno Mañana</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <CircleUser className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb + title */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <nav className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Inicio
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary">Admisión</span>
            </nav>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Admisión de Paquete
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              MOD1-UC-001 · Registro de nuevo envío
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-4 py-2 text-sm font-semibold text-foreground">
            <span className="flex h-2 w-2 rounded-full bg-warning shadow-[0_0_0_4px_oklch(0.72_0.17_65/0.2)]" />
            Paso 1: Datos Generales
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-3">
            {/* Sender card */}
            <FormCard
              icon={<User className="h-4 w-4" />}
              title="Datos del Remitente"
              iconBg="bg-primary/10 text-primary"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tipo de Documento">
                  <Select value={senderDocType} onValueChange={setSenderDocType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dni">DNI - Documento Nacional</SelectItem>
                      <SelectItem value="ruc">RUC</SelectItem>
                      <SelectItem value="ce">Carnet de Extranjería</SelectItem>
                      <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Número de Documento">
                  <Input placeholder="Ej: 70654321" />
                </Field>
              </div>

              <Field label="Nombre Completo / Razón Social">
                <Input placeholder="Ingrese nombre completo" />
              </Field>

              <Field label="Teléfono de Contacto">
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="999 999 999" />
                </div>
              </Field>
            </FormCard>

            {/* Receiver card */}
            <FormCard
              icon={<MapPin className="h-4 w-4" />}
              title="Datos del Destinatario"
              iconBg="bg-accent/15 text-accent"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tipo de Documento">
                  <Select
                    value={receiverDocType}
                    onValueChange={setReceiverDocType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dni">DNI - Documento Nacional</SelectItem>
                      <SelectItem value="ruc">RUC</SelectItem>
                      <SelectItem value="ce">Carnet de Extranjería</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Número de Documento">
                  <Input placeholder="Ej: 45678901" />
                </Field>
              </div>

              <Field label="Nombre Completo">
                <Input placeholder="Nombre de quien recibe" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Teléfono">
                  <Input placeholder="987 654 321" />
                </Field>
                <Field label="Correo Electrónico">
                  <Input type="email" placeholder="usuario@ejemplo.com" />
                </Field>
              </div>

              <Field label="Dirección de Entrega">
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Av. Principal 123, Distrito, Ciudad"
                  />
                </div>
              </Field>
            </FormCard>
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Coverage map card */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <h2 className="text-sm font-bold text-foreground">
                    Cobertura Geográfica
                  </h2>
                </div>
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                  Dentro de rango
                </span>
              </div>

              <div className="relative h-56 overflow-hidden bg-[var(--gradient-map)]">
                {/* faux map grid */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, oklch(1 0 0 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.4) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                {/* faux roads */}
                <div className="absolute left-0 right-0 top-1/3 h-1 -rotate-6 bg-card/60" />
                <div className="absolute bottom-1/3 left-0 right-0 h-1 rotate-3 bg-card/60" />

                <div className="relative flex h-full flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-warning shadow-[var(--shadow-elevated)]">
                      <MapPin className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                  <p className="rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                    <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-success" />
                    Destino validado correctamente
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping info */}
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
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">
                      Efectivo (Sede Central)
                    </SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="transferencia">
                      Transferencia Bancaria
                    </SelectItem>
                    <SelectItem value="yape">Yape / Plin</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FormCard>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                asChild
                size="lg"
                className="h-14 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)] transition-transform hover:scale-[1.01] hover:shadow-lg"
              >
                <Link to="/pesaje">
                  Continuar al Pesaje
                  <Truck className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-xs text-muted-foreground">
          <p>© 2024 PROSHITS S.A. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground">
              Soporte Técnico
            </a>
            <a href="#" className="hover:text-foreground">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FormCard({
  icon,
  title,
  iconBg,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  iconBg: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-center gap-2.5">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-md ${iconBg}`}
        >
          {icon}
        </span>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
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
