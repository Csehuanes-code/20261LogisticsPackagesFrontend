import { createFileRoute } from "@tanstack/react-router";
import { StoragePage } from "@/presentation/pages/StoragePage";

export const Route = createFileRoute("/gestion")({
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
