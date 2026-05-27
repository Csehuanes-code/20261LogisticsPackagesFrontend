import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/presentation/pages/RegisterPage";
import { getStoredToken, isTokenExpired } from "../infrastructure/api/auth.api";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    const token = getStoredToken();
    if (token && !isTokenExpired(token)) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
  head: () => ({
    meta: [{ title: "Registro · HERMES EXPRESS" }],
  }),
});
