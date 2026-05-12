import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  AlertTriangle,
  Inbox,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  LoaderCircle,
  ShieldCheck,
  Truck,
  Map,
  Signature,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/novedades")({
  component: NovedadesPage,
  head: () => ({
    meta: [
      { title: "Control de Novedades · HERMES EXPRESS" },
      {
        name: "description",
        content:
          "Bandeja de novedades, daños y reportes en ruta — HERMES EXPRESS.",
      },
    ],
  }),
});

const novedadesData = [
  {
    id: "PH-99283",
    type: "Dañado",
    title: "Paquete Dañado en Ruta",
    sub: "Reportado por: Carlos Ruiz (Transportista)",
    badge: { label: "Prioridad Alta", color: "bg-destructive/15 text-destructive" },
    time: "10 min",
    active: true,
    evidence: "evidencia_dano_ruta.jpg",
    description: "Se detectó caja mojada y golpeada durante la descarga en cliente final. El cliente rechaza la recepción."
  },
  {
    id: "PH-88412",
    type: "Devolución",
    title: "Intento de Devolución",
    sub: "Motivo: Cliente ausente en domicilio.",
    badge: { label: "En Revisión", color: "bg-warning/20 text-warning" },
    time: "25 min",
  },
  {
    id: "PH-77109",
    type: "Extraviado",
    title: "Reporte de Extravío",
    sub: "Reportado desde: HUB Logístico Norte",
    badge: { label: "Pendiente", color: "bg-secondary text-muted-foreground" },
    time: "1 h",
    description: "El paquete no fue encontrado durante el conteo cíclico en la estantería C-4."
  },
  {
    id: "PH-65432",
    type: "Entregado",
    title: "Paquete Entregado",
    sub: "Destino: Av. Principal, Monterrey, MX",
    badge: { label: "Cerrado", color: "bg-success/15 text-success" },
    time: "Ayer",
    evidence: "firma_recibido.png",
  },
  {
    id: "PH-54321",
    type: "En Tránsito",
    title: "Paquete en Tránsito",
    sub: "Próximo punto de control: C-05",
    badge: { label: "Activo", color: "bg-blue-500/15 text-blue-500" },
    time: "Ayer",
  },
];

const trazabilidad = [
  {
    label: "Salida de Bodega Central",
    time: "22/10/2025 - 08:30:15 AM",
    hash: "8f2b...1e90",
    state: "ok",
  },
  {
    label: "En Tránsito - Punto de Control A",
    time: "22/10/2025 - 11:45:22 AM",
    hash: "a4e1...f4d2",
    state: "ok",
  },
  {
    label: "Novedad Reportada: Daño en Empaque",
    time: "22/10/2025 - 02:15:40 PM",
    hash: "3c9d...bb81",
    state: "alert",
  },
] as const;

function NovedadesPage() {
  const [tab, setTab] = useState<"pendientes" | "historial">("pendientes");
  const [selectedNovedad, setSelectedNovedad] = useState(novedadesData[0]);
  const [isNotifying, setIsNotifying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const navigate = useNavigate();

  const handleNotify = () => {
    setIsNotifying(true);
    toast.loading("Enviando notificaciones a cliente y remitente...");
    setTimeout(() => {
      setIsNotifying(false);
      toast.dismiss();
      toast.success("Notificaciones enviadas correctamente.");
    }, 1500);
  };

  const handleClose = () => {
    setIsClosing(true);
    toast.loading("Cerrando novedad y exponiendo datos para Finanzas...");
    setTimeout(() => {
      setIsClosing(false);
      setIsClosed(true);
      toast.dismiss();
      toast.success("Novedad cerrada y lista para consulta financiera.");
    }, 2000);
  };
  
  const handleReclasificar = () => {
    toast.info("Redirigiendo a la pantalla de clasificación...");
    setTimeout(() => navigate({ to: "/clasificacion" }), 1000);
  }

  const renderActionPanel = () => {
    if (isClosed) {
      return (
        <Alert variant="success">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle className="font-bold">Novedad Cerrada</AlertTitle>
          <AlertDescription className="text-xs">
            Este caso fue resuelto y la información ya fue expuesta al Módulo de Finanzas.
          </AlertDescription>
        </Alert>
      );
    }

    switch (selectedNovedad.type) {
      case "Dañado":
      case "Extraviado":
        return (
          <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 text-sm font-bold text-foreground">Registrar Acción de Cierre</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Notas de Resolución</label>
                <Textarea rows={6} placeholder="Añadir veredicto final o acciones tomadas..." />
              </div>
              <Button variant="outline" className="h-11 w-full" onClick={handleNotify} disabled={isNotifying}>
                {isNotifying ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                {isNotifying ? 'Enviando...' : 'Notificar a Cliente'}
              </Button>
              <Button className="h-12 w-full bg-gradient-to-r from-primary to-primary-glow text-base font-bold shadow-[var(--shadow-elevated)]" onClick={handleClose} disabled={isClosing}>
                {isClosing ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                {isClosing ? 'Cerrando...' : 'Cerrar Novedad'}
              </Button>
            </div>
          </section>
        );
      case "Devolución":
        return (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Paquete Devuelto a Bodega</AlertTitle>
            <AlertDescription>
              El paquete debe ser re-procesado. Confirme para enviarlo de nuevo a clasificación.
            </AlertDescription>
            <Button className="mt-4 w-full" onClick={handleReclasificar}>Re-clasificar Paquete</Button>
          </Alert>
        );
      case "Entregado":
      case "En Tránsito":
        return null; // No actions needed for these states
      default:
        return null;
    }
  };

  return (
    <AppLayout 
      icon={<AlertTriangle className="h-5 w-5 text-destructive-foreground" />}
      title="HERMES EXPRESS"
      subtitle="Control de Novedades"
      iconBgClass="bg-gradient-to-br from-destructive to-warning shadow-[var(--shadow-elevated)]"
      showFinanzas={true}
      showNotif={true}
    >
      <main className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">Control de Novedades</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
          Control de Novedades
        </h1>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Bandeja */}
          <aside className="lg:col-span-3">
            <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="mb-4 flex items-center gap-2">
                <Inbox className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  Bandeja de Novedades
                </h2>
              </div>

              <div className="mb-4 flex gap-1 rounded-lg bg-secondary p-1">
                {(["pendientes", "historial"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                      tab === t
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t === "pendientes" ? "Pendientes (8)" : "Historial"}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {novedadesData.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setSelectedNovedad(n);
                      setIsClosed(false);
                    }}
                    className={`w-full rounded-lg border-l-4 p-3 text-left transition-colors ${
                      selectedNovedad.id === n.id
                        ? "border-l-primary bg-primary/5"
                        : "border-l-transparent bg-background hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-muted-foreground">
                        ID: #{n.id}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {n.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-foreground">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{n.sub}</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${n.badge.color}`}
                    >
                      {n.badge.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </aside>

          {/* Detalle */}
          <section className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-foreground">
                  Detalles del Paquete #{selectedNovedad.id}
                </h2>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${selectedNovedad.badge.color}`}>
                  {selectedNovedad.badge.label}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Cell label="Cliente" value="TecnoCorp S.A." />
                <Cell label="Ruta" value="R-450 (CABA)" />
                <Cell label="Destino" value={selectedNovedad.destination || "N/A"} />
              </div>

              {(selectedNovedad.description || selectedNovedad.evidence) && (
                <div className="mt-6 space-y-4">
                  {selectedNovedad.description && (
                    <Alert variant="default">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Descripción de la Novedad</AlertTitle>
                      <AlertDescription>{selectedNovedad.description}</AlertDescription>
                    </Alert>
                  )}
                  {selectedNovedad.evidence && (
                     <div className="rounded-lg border border-border bg-background p-3">
                      <p className="text-xs font-bold text-muted-foreground mb-2">Evidencia Adjunta</p>
                      <a href="#" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                        <Paperclip className="h-4 w-4" />
                        {selectedNovedad.evidence}
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    Trazabilidad
                  </h3>
                </div>

                <ol className="relative space-y-5 border-l-2 border-dashed border-border pl-6">
                  {trazabilidad.map((step) => (
                    <li key={step.hash} className="relative">
                      <span
                        className={`absolute -left-[33px] top-1 flex h-4 w-4 items-center justify-center rounded-full ${
                          step.state === "alert"
                            ? "bg-destructive"
                            : "bg-success"
                        }`}
                      >
                        {step.state === "alert" ? (
                          <XCircle className="h-3 w-3 text-destructive-foreground" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3 text-success-foreground" />
                        )}
                      </span>
                      <p
                        className={`text-sm font-bold ${
                          step.state === "alert"
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] italic text-muted-foreground">
                        {step.time} | Hash: {step.hash}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Acción */}
          <aside className="space-y-4 lg:col-span-4">
            {renderActionPanel()}
          </aside>
        </div>
      </main>
    </AppLayout>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
