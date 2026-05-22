import { createFileRoute } from "@tanstack/react-router";
import { ClassificationPage } from "@/presentation/pages/ClassificationPage";
import { z } from "zod";

const searchSchema = z.object({
  paqueteId: z.string().uuid("ID de paquete debe ser un UUID válido").optional(),
});

type SearchSchema = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/clasificacion")({
  component: ClassificationPage,
  validateSearch: (search: Record<string, unknown>): SearchSchema => {
    try {
      return searchSchema.parse(search);
    } catch (error) {
      console.warn("Search params validation failed:", error);
      return {};
    }
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
