import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { NoveltyReportPage } from "@/presentation/pages/NoveltyReportPage";

export const Route = createFileRoute("/reportar-novedad")({
  validateSearch: z.object({
    paqueteId: z.string().uuid().optional(),
  }),
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
