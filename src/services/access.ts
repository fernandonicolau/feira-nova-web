import { apiRequest } from "./http-client";

export const sessionQueryKey = ["access-session"] as const;

export function getSession() {
  return apiRequest<{ authenticated: true }>("/api/v1/access/session");
}

export function enterWithCode(code: string) {
  return apiRequest<{ authenticated: true }>("/api/v1/access/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
}

export function leaveSession() {
  return apiRequest<{ authenticated: false }>("/api/v1/access/session", { method: "DELETE" });
}
