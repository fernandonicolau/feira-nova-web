import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { ApiError } from "../services/http-client";
import { addDayText, createDay, dayKey, dayListKey, downloadDayOriginal, getDay, listDays, removeDayEntry, uploadDayFiles, type DayEntry, type UploadResult } from "../services/days";

function todayInSaoPaulo(): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

type Attempt = { files: File[]; id: string; replace?: string };

export function DayInbox() {
  const [day, setDay] = useState(todayInSaoPaulo);
  const [text, setText] = useState("");
  const [store, setStore] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [clientError, setClientError] = useState("");
  const textId = useRef(crypto.randomUUID());
  const client = useQueryClient();
  const days = useQuery({ queryKey: dayListKey, queryFn: listDays });
  const current = useQuery({ queryKey: dayKey(day), queryFn: () => getDay(day), retry: false });
  const refresh = () => { void client.invalidateQueries({ queryKey: dayListKey }); void client.invalidateQueries({ queryKey: dayKey(day) }); };
  const upload = useMutation({ mutationFn: async (input: Attempt) => { await createDay(day); return uploadDayFiles(day, input.files, input.id, input.replace); }, onSuccess: (value) => { setResult(value); if (!value.failures.length) setAttempt(null); refresh(); } });
  const manual = useMutation({ mutationFn: async () => { await createDay(day); return addDayText(day, text, textId.current, store); }, onSuccess: () => { setText(""); setStore(""); setManualOpen(false); textId.current = crypto.randomUUID(); refresh(); } });
  const remove = useMutation({ mutationFn: (id: string) => removeDayEntry(day, id), onSuccess: refresh });
  const download = useMutation({ mutationFn: (id: string) => downloadDayOriginal(day, id), onSuccess: ({ blob, name }) => { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); } });

  function sendFiles(input: FileList | File[], replace?: string) {
    const files = Array.from(input);
    if (!files.length) return;
    if (files.length > 10 || files.some((file) => !/\.(xlsx|xlsm|zip)$/i.test(file.name))) { setClientError("Selecione até 10 arquivos XLSX, XLSM ou ZIP."); return; }
    setClientError(""); setResult(null);
    const next = { files, id: crypto.randomUUID(), replace };
    setAttempt(next); upload.mutate(next);
  }

  function removeConfirmed(entry: DayEntry) {
    if (window.confirm(`Remover ${entry.file_name || "esta entrada manual"} deste dia?`)) remove.mutate(entry.id);
  }

  const entries = current.data?.entries ?? [];
  const missing = current.error instanceof ApiError && current.error.status === 404;
  const error = current.isError && !missing ? current.error : days.error;
  return <div className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Pedidos do dia</p><h1 className="mt-2 text-3xl font-bold">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`))}</h1><p className="mt-2 text-sm text-muted-foreground">Envie agora. Processe quando quiser.</p></div><label className="text-sm font-semibold">Outro dia<Input aria-label="Escolher dia" className="mt-2" type="date" value={day} onChange={(event) => { if (event.target.value) { setDay(event.target.value); setAttempt(null); setResult(null); } }} /></label></header>
    {days.data && days.data.length > 0 && <nav aria-label="Dias recentes" className="flex flex-wrap gap-2">{days.data.slice(0, 7).map((item) => <button className={`rounded-full px-3 py-1.5 text-xs font-semibold ${item.day === day ? "bg-primary text-primary-foreground" : "bg-muted"}`} key={item.id} onClick={() => setDay(item.day)} type="button">{item.day.slice(8, 10)}/{item.day.slice(5, 7)}</button>)}</nav>}
    {error && <p className="rounded-xl border border-error/30 bg-error-soft p-4 text-sm text-error" role="alert">{error instanceof ApiError ? error.message : "Não foi possível abrir o dia."}</p>}
    <Card className="p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Arquivos e textos</h2><p className="text-sm text-muted-foreground">{entries.length ? `${entries.length} entrada(s) recebida(s)` : "Nenhuma entrada neste dia"}</p></div><Button onClick={() => setManualOpen(!manualOpen)} variant="outline">Inserir manualmente</Button></div>
      <label className="mt-6 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center hover:border-primary" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); sendFiles(event.dataTransfer.files); }}><span className="font-semibold">{upload.isPending ? "Salvando arquivos…" : "Adicionar arquivos"}</span><span className="text-sm text-muted-foreground">Arraste ou escolha XLSX, XLSM e ZIP</span><input accept=".xlsx,.xlsm,.zip" aria-label="Adicionar arquivos" className="sr-only" disabled={upload.isPending} multiple onChange={(event) => { if (event.target.files) sendFiles(event.target.files); event.target.value = ""; }} type="file" /></label>
      {manualOpen && <form className="mt-5 space-y-3 rounded-xl border border-border p-4" onSubmit={(event) => { event.preventDefault(); if (text.trim()) manual.mutate(); }}><h3 className="font-semibold">Entrada manual</h3><Input aria-label="Loja da entrada manual" placeholder="Loja (opcional)" value={store} onChange={(event) => setStore(event.target.value)} /><Textarea aria-label="Itens da entrada manual" placeholder={"2 BANANA PRATA\nABACATE 5"} required rows={5} value={text} onChange={(event) => setText(event.target.value)} /><Button disabled={!text.trim() || manual.isPending} type="submit">{manual.isPending ? "Salvando…" : "Salvar texto"}</Button>{manual.isError && <p className="text-sm text-error" role="alert">{manual.error instanceof ApiError ? manual.error.message : "Não foi possível salvar. Tente novamente."}</p>}</form>}
      {(clientError || upload.isError || result?.failures.length) ? <div className="mt-4 rounded-xl border border-error/30 bg-error-soft p-4 text-sm text-error" role="alert"><p>{clientError || (upload.isError ? upload.error instanceof ApiError ? upload.error.message : "Falha no envio." : "Alguns arquivos não foram salvos.")}</p>{result?.failures.map((item, index) => <p key={`${item.fileName}-${index}`}>{item.fileName}: {item.message}</p>)}{attempt && <Button className="mt-3" disabled={upload.isPending} onClick={() => upload.mutate(attempt)} variant="outline">Tentar novamente</Button>}</div> : null}
      {entries.length > 0 && <ul className="mt-6 divide-y divide-border">{entries.map((entry) => <li className="flex flex-wrap items-center justify-between gap-3 py-4" key={entry.id}><div><p className="text-sm font-semibold">{entry.file_name || "Entrada manual"}</p><p className="text-xs text-muted-foreground">{entry.kind === "file" ? `${Math.round((entry.byte_size ?? 0) / 1024)} KB` : `${entry.manual_text?.split(/\r?\n/).filter(Boolean).length ?? 0} linhas`} · Recebido{entry.store ? ` · ${entry.store}` : ""}</p></div><div className="flex items-center gap-2">{entry.upload_id && <Button aria-label={`Baixar original de ${entry.file_name}`} disabled={download.isPending} onClick={() => download.mutate(entry.upload_id!)} variant="outline">Baixar</Button>}{entry.kind === "file" && <label className="cursor-pointer rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">Substituir<input accept=".xlsx,.xlsm" aria-label={`Substituir ${entry.file_name}`} className="sr-only" type="file" onChange={(event) => { if (event.target.files?.length && window.confirm(`Substituir ${entry.file_name}?`)) sendFiles(event.target.files, entry.id); event.target.value = ""; }} /></label>}<Button aria-label={`Remover ${entry.file_name || "entrada manual"}`} disabled={remove.isPending} onClick={() => removeConfirmed(entry)} variant="outline">Remover</Button></div></li>)}</ul>}
    </Card>
    <p className="text-sm text-muted-foreground">Os arquivos ficam salvos neste dia. O processamento será adicionado em uma próxima etapa.</p>
  </div>;
}
