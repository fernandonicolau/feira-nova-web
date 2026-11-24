import { afterEach, expect, it, vi } from "vitest";
import { addDayText, uploadDayFiles } from "./days";

afterEach(() => vi.unstubAllGlobals());

it("sends files and the stable retry id without starting processing", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ entries: [], failures: [] }), { status: 201 }));
  vi.stubGlobal("fetch", fetchMock);
  const file = new File(["spreadsheet"], "pedido.xlsx");
  await uploadDayFiles("2026-11-24", [file], "retry-12345678");
  const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toContain("/api/v1/days/2026-11-24/files");
  expect(request.credentials).toBe("include");
  expect((request.body as FormData).get("clientUploadId")).toBe("retry-12345678");
  const uploaded = (request.body as FormData).get("files") as File;
  expect(uploaded.name).toBe("pedido.xlsx");
  expect(uploaded.size).toBe(file.size);
});

it("sends manual text to the selected day", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "entry-1" }), { status: 201 }));
  vi.stubGlobal("fetch", fetchMock);
  await addDayText("2026-11-24", "ABACATE 5", "entry-12345678");
  const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toContain("/api/v1/days/2026-11-24/texts");
  expect(JSON.parse(String(request.body))).toEqual({ text: "ABACATE 5", clientEntryId: "entry-12345678" });
});
