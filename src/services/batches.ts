import type { ProcessBatchResponse, TextBatchInput } from "../types/batch";
import { apiRequest } from "./http-client";

export async function processTextBatch(input: TextBatchInput): Promise<ProcessBatchResponse> {
  const form = new FormData();
  form.set(
    "batch",
    JSON.stringify({
      name: input.name,
      entries: [{ id: "manual-1", type: "text", store: input.store, text: input.text }],
    }),
  );

  return apiRequest<ProcessBatchResponse>("/api/v1/batches/process", { method: "POST", body: form });
}
