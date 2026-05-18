import axios, { AxiosError } from "axios";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "auth_token";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "15000", 10),
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  codigo?: string;
  mensaje?: string;
  errores?: Array<{ campo: string; mensaje: string }>;
}

export function parseApiError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data as ApiErrorResponse;
  }
  return {
    codigo: "ERROR_INESPERADO",
    mensaje: error instanceof Error ? error.message : "Error inesperado",
  };
}

export { getToken, removeToken, TOKEN_KEY };
export default api;
