import { env } from "../lib/env";
import type { ApiErrorPayload } from "../types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    throw new ApiError(
      payload.error?.message || `A API respondeu com status ${response.status}.`,
      response.status,
      payload.requestId || response.headers.get("x-request-id") || undefined,
    );
  }

  return (await response.json()) as T;
}
