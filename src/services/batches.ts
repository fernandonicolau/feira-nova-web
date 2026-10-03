import type { ProcessBatchResponse, TextBatchInput, UnifiedBatchInput } from "../types/batch";
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

function unifiedBatchForm(input: UnifiedBatchInput): FormData {
  const form = new FormData();
  const fileEntries = input.files.map((item, index) => {
    const fileRef = `upload-${index + 1}`;
    form.append(fileRef, item.file, item.file.name);
    return { id: item.id, type: "file", store: item.store, fileRef };
  });
  form.set("batch", JSON.stringify({
    name: input.name,
    entries: [
      ...fileEntries,
      ...input.texts.map((item) => ({ ...item, type: "text" })),
    ],
  }));
  return form;
}

export function processUnifiedBatch(input: UnifiedBatchInput) {
  return apiRequest<ProcessBatchResponse>("/api/v1/batches/process", {
    method: "POST",
    body: unifiedBatchForm(input),
  });
}

export function downloadUnifiedBatch(input: UnifiedBatchInput) {
  return apiDownload("/api/v1/batches/process/download", {
    method: "POST",
    body: unifiedBatchForm(input),
  });
}
