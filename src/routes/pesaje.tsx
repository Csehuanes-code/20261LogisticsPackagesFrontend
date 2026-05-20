import { createFileRoute } from "@tanstack/react-router";
import { WeighingPage } from "@/presentation/pages/WeighingPage";

export const Route = createFileRoute("/pesaje")({
  component: WeighingPage,
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
