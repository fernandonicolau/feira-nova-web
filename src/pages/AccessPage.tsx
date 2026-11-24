import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { enterWithCode, sessionQueryKey } from "../services/access";
import { ApiError } from "../services/http-client";

export function AccessPage({ unavailable = false }: { unavailable?: boolean }) {
  const [code, setCode] = useState("");
  const queryClient = useQueryClient();
  const login = useMutation({
    mutationFn: enterWithCode,
    onSuccess: () => { setCode(""); void queryClient.invalidateQueries({ queryKey: sessionQueryKey }); },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (/^\d{6}$/.test(code)) login.mutate(code);
  }

  return <main className="mx-auto flex min-h-[calc(100vh-74px)] max-w-md items-center px-5 py-12">
    <Card className="w-full p-7 sm:p-9">
      <p className="text-sm font-semibold text-primary">Feira Nova</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Acessar pedidos</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Digite o código de seis dígitos para continuar.</p>
      <form className="mt-7 space-y-4" onSubmit={submit}>
        <label className="block text-sm font-semibold" htmlFor="access-code">Código de acesso</label>
        <Input id="access-code" autoComplete="one-time-code" autoFocus inputMode="numeric" maxLength={6} pattern="[0-9]{6}" placeholder="000000" required type="text" value={code} onChange={(event) => { setCode(event.target.value.replace(/\D/g, "").slice(0, 6)); login.reset(); }} />
        {login.isError && <p className="text-sm text-error" role="alert">{login.error instanceof ApiError ? login.error.message : "Não foi possível entrar."}</p>}
        {unavailable && !login.isError && <p className="text-sm text-error" role="alert">Acesso indisponível. Verifique a configuração da API.</p>}
        <Button className="w-full" disabled={code.length !== 6 || login.isPending} type="submit">{login.isPending ? "Entrando…" : "Entrar"}</Button>
      </form>
    </Card>
  </main>;
}
