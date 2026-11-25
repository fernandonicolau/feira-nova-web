const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const env = {
  apiUrl: import.meta.env.PROD ? "" : (configuredApiUrl || "http://localhost:3000").replace(/\/$/, ""),
} as const;
