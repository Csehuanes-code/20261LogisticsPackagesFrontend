import { createFileRoute } from "@tanstack/react-router";
import { AdmissionPage } from "@/presentation/pages/AdmissionPage";
import { useCases } from "@/lib/di";

export const Route = createFileRoute("/admision")({
  component: AdmissionPage,
  loader: async () => {
    // Los loaders deben ser idempotentes y no deben ejecutar mutaciones.
    // El registro del paquete se hace desde el componente cuando el usuario envía el formulario.
    return {};
  },
  head: () => ({
    meta: [
      { title: "Admisión de Paquete · HERMES EXPRESS" },
      {
        name: "description",
        content:
          "Registro y admisión de paquetes — sistema logístico profesional HERMES EXPRESS para envíos nacionales.",
      },
    ],
  }),
});
