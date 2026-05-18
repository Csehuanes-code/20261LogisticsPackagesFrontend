import axios, { AxiosInstance, AxiosError } from "axios";

/**
 * Interfaz para errores parseados de la API
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Cliente HTTP configurado para la aplicación
 * Utiliza axios como implementación base
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de respuesta para manejo global de errores
 */
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Aquí se pueden agregar lógicas globales como refresh tokens, logging, etc.
    return Promise.reject(error);
  }
);

/**
 * Parsea errores de la API a un formato consistente
 * @param error Error capturado de axios u otro origen
 * @returns Objeto ApiError con información estructurada
 */
export function parseApiError(error: unknown): ApiError {
  // Error de axios con respuesta del servidor
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
      details?: unknown;
    }>;

    if (axiosError.response) {
      return {
        message:
          axiosError.response.data?.message ||
          axiosError.response.data?.error ||
          `Error HTTP ${axiosError.response.status}`,
        statusCode: axiosError.response.status,
        details: axiosError.response.data?.details,
      };
    }

    // Error de red (sin respuesta del servidor)
    if (axiosError.request) {
      return {
        message: "Error de conexión: no se pudo contactar con el servidor",
        statusCode: 0,
      };
    }
  }

  // Error genérico o desconocido
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  // Error sin estructura conocida
  return {
    message: "Error desconocido",
    details: error,
  };
}
