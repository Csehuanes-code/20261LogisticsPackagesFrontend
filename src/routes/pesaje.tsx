import { createFileRoute } from "@tanstack/react-router";
import { WeighingPage } from "@/presentation/pages/WeighingPage";
import { useCases } from "@/lib/di";

export const Route = createFileRoute("/pesaje")({
  component: WeighingPage,
  loader: async () => {
    const result = await useCases.processWeighing.execute({
      packageId: "PRX-9823-UUID",
      weightKg: 52.4,
      lengthCm: 100,
      widthCm: 80,
      heightCm: 60,
      distanceKm: 840,
    });
    return result;
  },
  head: () => ({
    meta: [
      { title: "Pesaje y Dimensiones · HERMES EXPRESS" },
      {
        name: "description",
        content: "Pesaje, dimensiones y desglose de precios del paquete — HERMES EXPRESS.",
      },
    ],
  }),
});
