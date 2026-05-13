import { useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { BreadcrumbNav } from "../components/shared/BreadcrumbNav";
import { NoveltyInbox } from "../components/novelty/NoveltyInbox";
import { NoveltyDetail } from "../components/novelty/NoveltyDetail";
import { ActionPanel } from "../components/novelty/ActionPanel";
import { useNovelty } from "../hooks/use-novelty";
import { Novelty } from "@/domain/entities/novelty.entity";
import { toast } from "sonner";

const noveltiesMock: Novelty[] = [];

export function NoveltyControlPage() {
  const { findAll, notify, close } = useNovelty();
  const [novelties, setNovelties] = useState<Novelty[]>([]);
  const [selectedNovedad, setSelectedNovedad] = useState<Novelty | null>(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useState(() => {
    findAll()
      .then(setNovelties)
      .then((list) => {
        if (list.length > 0) setSelectedNovedad(list[0]);
      });
  });

  const handleNotify = () => {
    if (!selectedNovedad) return;
    setIsNotifying(true);
    toast.loading("Enviando notificaciones a cliente y remitente...");
    setTimeout(async () => {
      await notify({ noveltyId: selectedNovedad.id });
      setIsNotifying(false);
      toast.dismiss();
      toast.success("Notificaciones enviadas correctamente.");
    }, 1500);
  };

  const handleClose = () => {
    if (!selectedNovedad) return;
    setIsClosing(true);
    toast.loading("Cerrando novedad y exponiendo datos para Finanzas...");
    setTimeout(async () => {
      await close({ noveltyId: selectedNovedad.id });
      setIsClosing(false);
      setIsClosed(true);
      toast.dismiss();
      toast.success("Novedad cerrada y lista para consulta financiera.");
    }, 2000);
  };

  const handleReclassify = () => {
    toast.info("Redirigiendo a la pantalla de clasificación...");
  };

  if (!selectedNovedad) {
    return (
      <AppLayout
        icon={<AlertTriangle className="h-5 w-5 text-destructive-foreground" />}
        title="HERMES EXPRESS"
        subtitle="Control de Novedades"
        iconBgClass="bg-gradient-to-br from-destructive to-warning shadow-[var(--shadow-elevated)]"
      >
        <main className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-center text-muted-foreground">Cargando novedades...</p>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      icon={<AlertTriangle className="h-5 w-5 text-destructive-foreground" />}
      title="HERMES EXPRESS"
      subtitle="Control de Novedades"
      iconBgClass="bg-gradient-to-br from-destructive to-warning shadow-[var(--shadow-elevated)]"
    >
      <main className="mx-auto max-w-7xl px-6 py-8">
        <BreadcrumbNav items={[{ label: "Control de Novedades" }]} />

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
          Control de Novedades
        </h1>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <NoveltyInbox
              novelties={novelties}
              selectedId={selectedNovedad.id}
              onSelect={setSelectedNovedad}
              onResetClosed={() => setIsClosed(false)}
            />
          </aside>

          <section className="lg:col-span-5">
            <NoveltyDetail novelty={selectedNovedad} />
          </section>

          <aside className="space-y-4 lg:col-span-4">
            <ActionPanel
              novelty={selectedNovedad}
              isClosed={isClosed}
              isNotifying={isNotifying}
              isClosing={isClosing}
              onNotify={handleNotify}
              onClose={handleClose}
              onReclassify={handleReclassify}
            />
          </aside>
        </div>
      </main>
    </AppLayout>
  );
}
