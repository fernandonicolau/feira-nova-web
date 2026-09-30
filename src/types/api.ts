export interface HealthResponse {
  status: "ok";
}

export interface ApiErrorPayload {
  requestId?: string;
  error?: {
    code?: string;
    message?: string;
    details?: unknown[];
  };
}
