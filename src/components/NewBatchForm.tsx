import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, DownloadSimple, FileArchive, FileXls, Plus, SpinnerGap, Trash } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { downloadUnifiedBatch, processUnifiedBatch } from "../services/batches";
import { ApiError } from "../services/http-client";
import type { UnifiedBatchInput } from "../types/batch";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";

const stores = ["Cerâmica", "Coelho", "Queimados", "Piabetá", "Anchieta", "Olinda", "Santa Cruz", "Irajá", "Cachambi", "Santos", "Freguesia"];
const schema = z.object({
  name: z.string().trim().min(3).max(120),
  texts: z.array(z.object({ store: z.string(), text: z.string().max(50_000) })).max(20),
});
type Values = z.infer<typeof schema>;
type SelectedFile = { id: string; file: File; store: string };

export function NewBatchForm() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "Pedido da manhã", texts: [{ store: "", text: "" }] } });
  const manuals = useFieldArray({ control: form.control, name: "texts" });
  const mutation = useMutation({ mutationFn: processUnifiedBatch });
  const download = useMutation({ mutationFn: downloadUnifiedBatch, onSuccess: ({ blob, fileName }) => {
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
    anchor.href = url; anchor.download = fileName; anchor.click(); URL.revokeObjectURL(url);
  }});

  function addFiles(list: FileList | File[]) {
    const accepted = Array.from(list).filter((file) => /\.(xlsx|xlsm|zip)$/i.test(file.name));
    setFiles((current) => [...current, ...accepted.map((file) => ({ id: crypto.randomUUID(), file, store: "" }))].slice(0, 10));
  }

  function submission(values: Values): UnifiedBatchInput {
    return {
      name: values.name,
      files,
      texts: values.texts.filter((item) => item.text.trim()).map((item, index) => ({ ...item, id: `manual-${index + 1}` })),
    };
  }

  return <form className="space-y-6" noValidate onSubmit={form.handleSubmit((values) => {
    const payload = submission(values);
    if ((!payload.files.length && !payload.texts.length) || payload.files.some((item) => !item.store) || payload.texts.some((item) => !item.store)) return;
    mutation.mutate(payload);
  })}>
    <Field htmlFor="batch-name" label="Nome do lote"><Input id="batch-name" {...form.register("name")} /></Field>

    <section className="space-y-3" aria-labelledby="uploads-title">
      <div><h3 className="font-semibold" id="uploads-title">Arquivos do pedido</h3><p className="text-sm text-muted-foreground">Arraste ou selecione até 10 arquivos XLSX, XLSM ou ZIP.</p></div>
      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center hover:border-primary" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files); }}>
        <FileArchive aria-hidden size={28} /><span className="mt-2 font-semibold">Solte os arquivos aqui</span><span className="text-sm text-muted-foreground">ou clique para selecionar</span>
        <input accept=".xlsx,.xlsm,.zip" className="sr-only" multiple onChange={(event) => event.target.files && addFiles(event.target.files)} type="file" />
      </label>
      {files.map((item) => <div className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[1fr_12rem_auto]" key={item.id}>
        <div className="flex items-center gap-2 text-sm">{item.file.name.toLowerCase().endsWith(".zip") ? <FileArchive /> : <FileXls />}<span className="truncate">{item.file.name}</span></div>
        <Select aria-label={`Loja de ${item.file.name}`} value={item.store} onChange={(event) => setFiles((current) => current.map((file) => file.id === item.id ? { ...file, store: event.target.value } : file))}><option value="">Selecione a loja</option>{stores.map((store) => <option key={store}>{store}</option>)}</Select>
        <Button aria-label={`Remover ${item.file.name}`} onClick={() => setFiles((current) => current.filter((file) => file.id !== item.id))} type="button" variant="outline"><Trash /></Button>
      </div>)}
    </section>

    <section className="space-y-3" aria-labelledby="manual-title"><div className="flex items-center justify-between"><div><h3 className="font-semibold" id="manual-title">Entradas manuais</h3><p className="text-sm text-muted-foreground">Quantidade antes ou depois do produto, uma linha por item.</p></div><Button onClick={() => manuals.append({ store: "", text: "" })} type="button" variant="outline"><Plus />Adicionar</Button></div>
      {manuals.fields.map((field, index) => <div className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[12rem_1fr_auto]" key={field.id}><Select aria-label={`Loja da entrada manual ${index + 1}`} {...form.register(`texts.${index}.store`)}><option value="">Selecione a loja</option>{stores.map((store) => <option key={store}>{store}</option>)}</Select><Textarea aria-label={`Itens da entrada manual ${index + 1}`} placeholder={"2 BANANA PRATA\nABACATE 5"} {...form.register(`texts.${index}.text`)} /><Button aria-label={`Remover entrada manual ${index + 1}`} disabled={manuals.fields.length === 1} onClick={() => manuals.remove(index)} type="button" variant="outline"><Trash /></Button></div>)}
    </section>

    {mutation.isError && <div className="rounded-xl border border-error/30 bg-error-soft p-4 text-sm text-error" role="alert">{mutation.error instanceof ApiError ? mutation.error.message : "Não foi possível processar o lote."}</div>}
    {mutation.isSuccess && <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success" role="status"><CheckCircle className="inline" size={20} /> <strong>Lote processado:</strong> {mutation.data.data.summary.items} itens, {mutation.data.data.summary.artifacts} artefatos.{mutation.data.warnings.map((warning) => <p className="mt-1" key={`${warning.entryId}-${warning.message}`}>{warning.message}</p>)}</div>}
    <div className="flex flex-wrap gap-3"><Button disabled={mutation.isPending} size="lg" type="submit">{mutation.isPending && <SpinnerGap className="animate-spin" />}Processar pedido</Button>{mutation.isSuccess && mutation.variables && <Button disabled={download.isPending} onClick={() => download.mutate(mutation.variables!)} size="lg" type="button" variant="outline"><DownloadSimple />{download.isPending ? "Preparando ZIP…" : "Baixar arquivos (.zip)"}</Button>}</div>
  </form>;
}
