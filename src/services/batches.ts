import type { ProcessBatchResponse, TextBatchInput } from "../types/batch";
import { apiDownload, apiRequest } from "./http-client";

function textBatchForm(input: TextBatchInput): FormData {
  const form = new FormData();
  form.set(
    "batch",
    JSON.stringify({
      name: input.name,
      entries: [{ id: "manual-1", type: "text", store: input.store, text: input.text }],
    }),
  );
  return form;
}

export async function processTextBatch(input: TextBatchInput): Promise<ProcessBatchResponse> {
  return apiRequest<ProcessBatchResponse>("/api/v1/batches/process", {
    method: "POST",
    body: textBatchForm(input),
  });
}

export function downloadTextBatch(input: TextBatchInput) {
  return apiDownload("/api/v1/batches/process/download", {
    method: "POST",
    body: textBatchForm(input),
  });
}
