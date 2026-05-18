import { createFileRoute } from "@tanstack/react-router";
import { AdmissionPage } from "@/presentation/pages/AdmissionPage";
import { useCases } from "@/lib/di";

export const Route = createFileRoute("/admision")({
  component: AdmissionPage,
  loader: async () => {
    const packages = await useCases.registerPackage.execute({
      id: "PRX-9823-UUID",
      sender: {
        documentType: "dni" as const,
        documentNumber: "70654321",
        fullName: "Juan Pérez",
        phone: "999 999 999",
      },
      recipient: {
        documentType: "dni" as const,
        documentNumber: "45678901",
        fullName: "Ana López",
        phone: "987 654 321",
        email: "ana@ejemplo.com",
        address: "Av. Principal 123, Monterrey, MX",
      },
      merchandiseType: "fragil" as const,
      declaredValue: 500,
      paymentMethod: "efectivo" as const,
    });
    return { package: packages.package };
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
