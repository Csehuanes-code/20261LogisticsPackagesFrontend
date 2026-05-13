import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/presentation/pages/LoginPage";
import { getStoredToken, isTokenExpired } from "../infrastructure/api/auth.api";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const token = getStoredToken();
    if (token && !isTokenExpired(token)) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Iniciar Sesión · HERMES EXPRESS" }],
  }),
});
