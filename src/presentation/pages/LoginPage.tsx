import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Package, LogIn, Loader2 } from "lucide-react";
import { login } from "../../infrastructure/api/auth.api";
import { useAuth } from "../../lib/auth-context";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      setAuth(result.user.username, result.user);
      navigate({ to: "/" });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">HERMES EXPRESS</h1>
          <p className="mt-1 text-sm text-muted-foreground">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
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
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Registrarse
          </Link>
        </p>

        <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Usuarios de prueba:</p>
          <p>admin / admin123</p>
          <p>operador / operador123</p>
        </div>
      </div>
    </div>
  );
}
