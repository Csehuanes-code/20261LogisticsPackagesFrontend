import { createFileRoute } from "@tanstack/react-router";
import { ClassificationPage } from "@/presentation/pages/ClassificationPage";
import { useCases } from "@/lib/di";

export const Route = createFileRoute("/clasificacion")({
  component: ClassificationPage,
  loader: async () => {
    const classification = await useCases.classifyDestination.execute({
      packageId: "PRX-9823-UUID",
      zoneId: "ZN",
    });
    return classification;
  },
  head: () => ({
    meta: [
      { title: "Clasificación por Zona · HERMES EXPRESS" },
      {
        name: "description",
        content: "Clasificación de paquetes por zona de destino para optimizar la carga.",
      },
    ],
  }),
});
