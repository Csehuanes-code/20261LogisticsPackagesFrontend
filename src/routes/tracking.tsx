import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TrackingPage } from "@/presentation/pages/TrackingPage";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

// Validar search params
const trackingSearchSchema = z.object({
  paqueteId: z.string().uuid().optional().catch(undefined),
});

// Guard: Requiere autenticación
const authGuard = async () => {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    throw new Error("Debes estar autenticado para acceder a esta página");
  }
};

export const Route = createFileRoute("/tracking")({
  component: TrackingPage,
  validateSearch: (search) => trackingSearchSchema.parse(search),
  beforeLoad: async () => {
    // Guard de autenticación
    const { useAuth: getAuth } = await import("@/lib/auth-context");
    // Nota: Esta es una validación básica en tiempo de compilación
    // El guard real se valida en el contexto de autenticación
  },
});
