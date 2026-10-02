import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, SpinnerGap } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { processTextBatch } from "../services/batches";
import { ApiError } from "../services/http-client";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";
import { fieldAria } from "./ui/field-aria";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";

const batchSchema = z.object({
  name: z.string().trim().min(3, "Informe um nome com pelo menos 3 caracteres.").max(120),
  store: z.string().min(1, "Selecione a loja de origem."),
  text: z.string().trim().min(3, "Inclua ao menos um produto e sua quantidade.").max(50_000),
});
type BatchFormValues = z.infer<typeof batchSchema>;

export function NewBatchForm() {
  const form = useForm<BatchFormValues>({ resolver: zodResolver(batchSchema), defaultValues: { name: "Pedido da manhã", store: "", text: "" } });
  const mutation = useMutation({ mutationFn: processTextBatch });
  const errors = form.formState.errors;
  return (
    <form className="space-y-5" noValidate onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field htmlFor="batch-name" label="Nome do lote" error={errors.name?.message}><Input id="batch-name" autoComplete="off" {...fieldAria(false, Boolean(errors.name), "batch-name")} {...form.register("name")} /></Field>
        <Field htmlFor="batch-store" label="Loja de origem" error={errors.store?.message}><Select id="batch-store" {...fieldAria(false, Boolean(errors.store), "batch-store")} {...form.register("store")}><option value="">Selecione uma loja</option><option value="Cerâmica">Cerâmica</option><option value="Coelho">Coelho</option><option value="Queimados">Queimados</option></Select></Field>
      </div>
      <Field htmlFor="batch-text" label="Itens do pedido" description="Use uma linha por item, por exemplo: BANANA PRATA 5. Linhas não reconhecidas serão devolvidas como aviso." error={errors.text?.message}><Textarea id="batch-text" placeholder={"BANANA PRATA 5\nABACATE 2"} {...fieldAria(true, Boolean(errors.text), "batch-text")} {...form.register("text")} /></Field>
      {mutation.isError && <div className="rounded-xl border border-error/30 bg-error-soft p-4 text-sm text-error" role="alert"><strong className="block">Não foi possível processar o lote.</strong><span>{mutation.error instanceof ApiError ? mutation.error.message : "Tente novamente em instantes."}</span></div>}
      {mutation.isSuccess && <div className="flex gap-3 rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success" role="status"><CheckCircle aria-hidden size={22} weight="fill" /><div><strong className="block">Lote processado com sucesso.</strong><span>{mutation.data.data.summary.items} itens e {mutation.data.data.summary.artifacts} artefatos preparados.</span></div></div>}
      <Button className="w-full sm:w-auto" disabled={mutation.isPending} size="lg" type="submit">{mutation.isPending && <SpinnerGap aria-hidden className="animate-spin" size={20} />}{mutation.isPending ? "Processando…" : "Processar pedido"}</Button>
    </form>
  );
}
