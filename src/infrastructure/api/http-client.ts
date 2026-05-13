const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export interface HttpClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config?: HttpClientConfig) {
    this.baseUrl = config?.baseUrl ?? BASE_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config?.headers,
    };
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: this.defaultHeaders,
    });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.defaultHeaders,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers: this.defaultHeaders,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
    return res.json();
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: this.defaultHeaders,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
    return res.json();
  }
}

export const httpClient = new HttpClient();
