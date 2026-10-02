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
