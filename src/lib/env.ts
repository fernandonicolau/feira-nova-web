const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const env = {
  apiUrl: (configuredApiUrl || "http://localhost:3000").replace(/\/$/, ""),
} as const;
