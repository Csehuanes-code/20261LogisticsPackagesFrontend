import { createFileRoute } from "@tanstack/react-router";
import { DiscrepancyPage } from "@/presentation/pages/DiscrepancyPage";

export const Route = createFileRoute("/discrepancia")({
  component: DiscrepancyPage,
  head: () => ({
    meta: [
      { title: "Reportar Discrepancia Física · HERMES EXPRESS" },
      {
        name: "description",
        content:
          "Corrección de discrepancias físicas detectadas en pesaje y dimensiones — HERMES EXPRESS.",
      },
    ],
  }),
});
