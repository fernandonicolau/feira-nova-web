import { useEffect, useState } from "react";
import { env } from "../lib/env";
import { getApiHealth } from "../services/health";

type ApiState = "checking" | "online" | "offline";

export function HomePage() {
  const [apiState, setApiState] = useState<ApiState>("checking");

  useEffect(() => {
    const controller = new AbortController();
    getApiHealth(controller.signal)
      .then(() => setApiState("online"))
      .catch(() => setApiState("offline"));
    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:py-24">
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Operação de hortifruti
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          Pedidos organizados, mapas prontos para trabalhar.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          A nova interface do Feira Nova está sendo preparada para receber arquivos e entradas manuais sem duplicar as regras do motor de processamento.
        </p>
      </div>

      <aside className="self-start rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
        <p className="text-sm font-medium text-slate-500">Conexão com a API</p>
        <div className="mt-3 flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`size-3 rounded-full ${
              apiState === "online"
                ? "bg-emerald-500"
                : apiState === "offline"
                  ? "bg-rose-500"
                  : "animate-pulse bg-amber-400"
            }`}
          />
          <strong className="text-lg">
            {apiState === "online"
              ? "API disponível"
              : apiState === "offline"
                ? "API indisponível"
                : "Verificando…"}
          </strong>
        </div>
        <p className="mt-3 break-all text-sm text-slate-500">{env.apiUrl}</p>
      </aside>
    </section>
  );
}
