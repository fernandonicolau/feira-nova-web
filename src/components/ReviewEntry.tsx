import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listKnownStores, reviewDayEntry, type ColumnLayout, type DayEntry } from "../services/days";
import { ApiError } from "../services/http-client";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

const defaultPairs = [{ nameColumn: "A", quantityColumn: "B" }];

export function ReviewEntry({ day, entry, onSaved }: { day: string; entry: DayEntry; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState(entry.store || entry.detected_store || "");
  const [headerRow, setHeaderRow] = useState(entry.layout?.headerRow ?? 0);
  const [pairs, setPairs] = useState<ColumnLayout["pairs"]>(entry.layout?.pairs ?? defaultPairs);
  const stores = useQuery({ queryKey: ["known-stores"], queryFn: listKnownStores, enabled: open });
  const save = useMutation({ mutationFn: () => reviewDayEntry(day, entry.id, { store, layout: entry.kind === "file" ? { headerRow, pairs } : undefined }), onSuccess: () => { setOpen(false); onSaved(); } });

  function updatePair(index: number, key: "nameColumn" | "quantityColumn", value: string) {
    setPairs((current) => current.map((pair, position) => position === index ? { ...pair, [key]: value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2) } : pair));
  }

  return <div className="w-full sm:w-auto">
    <Button aria-label={`${entry.review_required ? "Revisar" : "Corrigir"} ${entry.file_name || "entrada manual"}`} onClick={() => setOpen(!open)} variant="outline">{entry.review_required ? "Revisar" : "Corrigir"}</Button>
    {open && <div className="mt-3 w-full space-y-3 rounded-xl border border-border bg-surface p-4 sm:min-w-72">
      <p className="text-sm font-semibold">{entry.review_required ? "Confirme este arquivo" : "Corrigir interpretação"}</p>
      {entry.source_file_name && entry.source_file_name !== entry.file_name && <p className="text-xs text-muted-foreground">Origem: {entry.source_file_name}</p>}
      {entry.kind === "file" && <div className="text-xs text-muted-foreground"><p>{entry.preview?.itemCount ?? 0} item(ns) na prévia</p>{entry.preview?.sampleItems?.slice(0, 4).map((item, index) => <p key={`${item.name}-${index}`}>{item.name} · {item.quantity}</p>)}</div>}
      {entry.preview?.warnings?.map((warning, index) => <p className="text-xs text-warning" key={`${warning}-${index}`}>{warning}</p>)}
      <label className="block text-xs font-semibold">Loja
        <select className="mt-1 w-full rounded-xl border border-input bg-surface p-2 text-sm" value={store} onChange={(event) => setStore(event.target.value)}>
          <option value="">Selecione a loja</option>
          {stores.data?.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </label>
      {entry.kind === "file" && <div className="space-y-2"><label className="block text-xs font-semibold">Linha do cabeçalho<Input className="mt-1" min={0} max={50} type="number" value={headerRow} onChange={(event) => setHeaderRow(Number(event.target.value))} /></label>
        {pairs.map((pair, index) => <div className="flex items-end gap-2" key={index}><label className="w-20 text-xs font-semibold">Nome<Input className="mt-1" maxLength={2} value={pair.nameColumn} onChange={(event) => updatePair(index, "nameColumn", event.target.value)} /></label><label className="w-20 text-xs font-semibold">Quantidade<Input className="mt-1" maxLength={2} value={pair.quantityColumn} onChange={(event) => updatePair(index, "quantityColumn", event.target.value)} /></label>{pairs.length > 1 && <button className="pb-2 text-xs text-error" onClick={() => setPairs((current) => current.filter((_, position) => position !== index))} type="button">Remover par</button>}</div>)}
        {pairs.length < 4 && <button className="text-xs font-semibold text-primary" onClick={() => setPairs((current) => [...current, { nameColumn: String.fromCharCode(65 + current.length * 2), quantityColumn: String.fromCharCode(66 + current.length * 2) }])} type="button">+ Outro par de colunas</button>}
      </div>}
      <Button disabled={!store || save.isPending} onClick={() => save.mutate()}>{save.isPending ? "Salvando…" : "Salvar correção"}</Button>
      {save.isError && <p className="text-xs text-error" role="alert">{save.error instanceof ApiError ? save.error.message : "Não foi possível salvar a correção."}</p>}
    </div>}
  </div>;
}
