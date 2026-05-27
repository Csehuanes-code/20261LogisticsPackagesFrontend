import { createFileRoute } from "@tanstack/react-router";
import { StoragePage } from "@/presentation/pages/StoragePage";
import { z } from "zod";

export const Route = createFileRoute("/gestion")({
  validateSearch: z.object({
    paqueteId: z.string().optional(),
  }).parse,
  component: StoragePage,
  head: () => ({
    meta: [
      { title: "Gestión de Ingreso · HERMES EXPRESS" },
      {
        name: "description",
        content: "Asignación de zonas, almacenaje y clasificación de paquetes — HERMES EXPRESS.",
      },
    ],
  }),
});
