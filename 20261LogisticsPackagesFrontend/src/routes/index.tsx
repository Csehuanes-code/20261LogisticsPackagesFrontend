import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/presentation/pages/HomePage";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Inicio · HERMES EXPRESS" },
      {
        name: "description",
        content:
          "Panel principal de HERMES EXPRESS — admisión, gestión de ingreso y control de novedades logísticas.",
      },
    ],
  }),
});
