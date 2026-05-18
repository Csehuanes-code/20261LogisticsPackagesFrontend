import { createFileRoute } from "@tanstack/react-router";
import { NoveltyReportPage } from "@/presentation/pages/NoveltyReportPage";

export const Route = createFileRoute("/reportar-novedad")({
  component: NoveltyReportPage,
  head: () => ({
    meta: [
      { title: "Reportar Novedad en Bodega · HERMES EXPRESS" },
      {
        name: "description",
        content: "Registro de paquetes dañados o extraviados en bodega.",
      },
    ],
  }),
});
