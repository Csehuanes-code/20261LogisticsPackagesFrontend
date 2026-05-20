import api, { getToken, removeToken, TOKEN_KEY, parseApiError } from "./http-client";

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  rol: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  nombreCompleto: string;
  rol?: string;
}

export interface AuthUser {
  username: string;
  rol: string;
}

export function getStoredToken(): string | null {
  return getToken();
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
  removeToken();
  localStorage.removeItem("auth_user");
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function login(
  username: string,
  password: string,
): Promise<{ success: true; user: AuthUser; token: string } | { success: false; error: string }> {
  try {
    const response = await api.post<LoginResponse>("/api/auth/login", { username, password });
    const { token, username: user, rol } = response.data;
    setStoredToken(token);
    const authUser: AuthUser = { username: user, rol };
    setStoredUser(authUser);
    return { success: true, user: authUser, token };
  } catch (error) {
    const parsed = parseApiError(error);
    if (parsed.codigo === "CREDENCIALES_INVALIDAS") {
      return { success: false, error: "Usuario o contraseña incorrectos" };
    }
    return { success: false, error: parsed.mensaje || "Error al conectar con el servidor" };
  }
}

export async function register(
  data: RegisterRequest,
): Promise<{ success: true; user: AuthUser; token: string } | { success: false; error: string }> {
  try {
    const response = await api.post<LoginResponse>("/api/auth/register", data);
    const { token, username, rol } = response.data;
    setStoredToken(token);
    const authUser: AuthUser = { username, rol };
    setStoredUser(authUser);
    return { success: true, user: authUser, token };
  } catch (error) {
    const parsed = parseApiError(error);
    return { success: false, error: parsed.mensaje || "Error al registrar usuario" };
  }
}

export function logout(): void {
  clearAuth();
  window.location.href = "/login";
}
