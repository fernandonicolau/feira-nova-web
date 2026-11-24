import { env } from "../lib/env";
import { ApiError, apiRequest } from "./http-client";

export interface DayRecord { id: string; day: string; revision: number; submissions_closed: boolean; created_at: string }
export interface DayEntry { id: string; kind: "file" | "text"; file_name: string | null; source_file_name?: string | null; manual_text: string | null; store: string | null; byte_size: number | null; state: string; upload_id: string | null; created_at: string }
export interface DayEvent { id: number; action: string; created_at: string; details: Record<string, unknown> }
export interface DayView { day: DayRecord; entries: DayEntry[]; events: DayEvent[] }
export interface UploadResult { entries: DayEntry[]; failures: Array<{ fileName: string; message: string }> }

export const dayListKey = ["days"] as const;
export const dayKey = (day: string) => ["days", day] as const;

export function listDays() { return apiRequest<DayRecord[]>("/api/v1/days"); }
export function createDay(day: string) { return apiRequest<DayRecord>(`/api/v1/days/${day}`, { method: "PUT" }); }
export function getDay(day: string) { return apiRequest<DayView>(`/api/v1/days/${day}`); }

export function uploadDayFiles(day: string, files: File[], clientUploadId: string, replaceEntryId?: string) {
  const form = new FormData();
  form.set("clientUploadId", clientUploadId);
  files.forEach((file) => form.append("files", file, file.name));
  const path = replaceEntryId ? `/api/v1/days/${day}/entries/${replaceEntryId}/replace` : `/api/v1/days/${day}/files`;
  return apiRequest<UploadResult>(path, { method: "POST", body: form });
}

export function addDayText(day: string, text: string, clientEntryId: string, store?: string) {
  return apiRequest<DayEntry>(`/api/v1/days/${day}/texts`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, clientEntryId, store: store || undefined }),
  });
}

export function removeDayEntry(day: string, id: string) {
  return apiRequest<{ removed: true }>(`/api/v1/days/${day}/entries/${id}`, { method: "DELETE" });
}

export async function downloadDayOriginal(day: string, uploadId: string): Promise<{ blob: Blob; name: string }> {
  const response = await fetch(`${env.apiUrl}/api/v1/days/${day}/uploads/${uploadId}/original`, { credentials: "include" });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(payload?.error?.message || "Não foi possível baixar o original.", response.status);
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  return { blob: await response.blob(), name: encoded ? decodeURIComponent(encoded) : "original" };
}
