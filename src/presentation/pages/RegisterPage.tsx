import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Package, UserPlus, Loader2 } from "lucide-react";
import { register, type RegisterRequest } from "../../infrastructure/api/auth.api";
import { useAuth } from "../../lib/auth-context";

export function RegisterPage() {
  const [form, setForm] = useState<RegisterRequest>({
    username: "",
    password: "",
    email: "",
    nombreCompleto: "",
    rol: "OPERADOR_BODEGA",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await register(form);
    setLoading(false);

    if (result.success) {
      setAuth(result.user.username, result.user);
      navigate({ to: "/" });
    } else {
      setError(result.error);
    }
  };

  const update = (field: keyof RegisterRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Crear Cuenta</h1>
          <p className="mt-1 text-sm text-muted-foreground">Regístrate en HERMES EXPRESS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              value={form.nombreCompleto}
              onChange={(e) => update("nombreCompleto", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Usuario</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="nuevo_operador"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="operador@logistics.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Rol</label>
            <select
              value={form.rol}
              onChange={(e) => update("rol", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="OPERADOR_BODEGA">Operador de Bodega</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
