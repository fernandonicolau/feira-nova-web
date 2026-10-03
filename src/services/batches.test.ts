import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadTextBatch, processTextBatch } from "./batches";

const input = { name: "Pedido teste", store: "Cerâmica", text: "BANANA PRATA 2" };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("batch API client", () => {
  it("sends the canonical manual contract", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ requestId: "req-1", data: { batchId: "batch-1" }, warnings: [] }), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await processTextBatch(input);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const form = init.body as FormData;
    expect(JSON.parse(String(form.get("batch")))).toEqual({
      name: input.name,
      entries: [{ id: "manual-1", type: "text", store: input.store, text: input.text }],
    });
  });

  it("returns the ZIP and server filename", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(new Blob(["zip"]), {
          status: 201,
          headers: {
            "content-disposition": 'attachment; filename="feira-nova-batch-1.zip"',
            "x-request-id": "req-2",
          },
        }),
      ),
    );

    await expect(downloadTextBatch(input)).resolves.toMatchObject({
      fileName: "feira-nova-batch-1.zip",
      requestId: "req-2",
    });
  });
});
