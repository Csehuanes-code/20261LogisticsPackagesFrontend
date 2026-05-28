import { createFileRoute } from "@tanstack/react-router";
import { NoveltyControlPage } from "@/presentation/pages/NoveltyControlPage";
import { useCases } from "@/lib/di";

export const Route = createFileRoute("/novedades")({
  component: NoveltyControlPage,
  loader: async () => {
    try {
      const novelties = await useCases.manageNovelty.findAll();
      return { novelties };
    } catch (error) {
      console.error("Error loading novelties:", error);
      return { novelties: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Control de Novedades · HERMES EXPRESS" },
      {
        name: "description",
        content: "Bandeja de novedades, daños y reportes en ruta — HERMES EXPRESS.",
      },
    ],
  }),
});
