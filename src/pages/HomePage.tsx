import { CloudCheck, CloudSlash } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { NewBatchForm } from "../components/NewBatchForm";
import { Card } from "../components/ui/Card";
import { env } from "../lib/env";
import { getApiHealth, healthQueryKey } from "../services/health";

export function HomePage() {
  const health = useQuery({ queryKey: healthQueryKey, queryFn: ({ signal }) => getApiHealth(signal) });
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-20">
      <section className="grid items-start gap-10 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="lg:sticky lg:top-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Operação de hortifruti</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">Transforme pedidos em mapas prontos para trabalhar.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Envie uma entrada manual para o mesmo motor que organiza os arquivos da operação, com validação antes do processamento.</p>
          <Card className="mt-8 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conexão com a API</p>
            <div className="mt-2 flex items-center gap-2">
              {health.isSuccess ? <CloudCheck aria-hidden className="text-success" size={22} weight="fill" /> : <CloudSlash aria-hidden className={health.isError ? "text-error" : "animate-pulse text-warning"} size={22} />}
              <strong>{health.isSuccess ? "API disponível" : health.isError ? "API indisponível" : "Verificando…"}</strong>
            </div>
            <p className="mt-2 break-all text-xs text-muted-foreground">{env.apiUrl}</p>
          </Card>
        </div>
        <Card className="p-6 sm:p-8">
          <div className="mb-7"><p className="text-sm font-semibold text-primary">Novo lote</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Entrada manual</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Identifique a loja e cole os itens exatamente como foram recebidos.</p></div>
          <NewBatchForm />
        </Card>
      </section>
    </main>
  );
}
