import type { HealthResponse } from "../types/api";
import { apiRequest } from "./http-client";

export function getApiHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return apiRequest<HealthResponse>("/health", { signal });
}
