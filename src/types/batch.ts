export interface BatchSummary {
  entries: number;
  files: number;
  texts: number;
  items: number;
  artifacts: number;
}

export interface ProcessBatchResponse {
  requestId: string;
  data: { batchId: string; summary: BatchSummary };
  warnings: Array<{ code: string; message: string; entryId?: string }>;
}

export interface TextBatchInput {
  name: string;
  store: string;
  text: string;
}

export interface UnifiedBatchInput {
  name: string;
  files: Array<{ id: string; file: File; store: string }>;
  texts: Array<{ id: string; store: string; text: string }>;
}
