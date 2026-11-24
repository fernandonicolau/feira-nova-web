import { AppShell } from "./components/AppShell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessPage } from "./pages/AccessPage";
import { HomePage } from "./pages/HomePage";
import { getSession, leaveSession, sessionQueryKey } from "./services/access";
import { ApiError } from "./services/http-client";

export default function App() {
  const queryClient = useQueryClient();
  const session = useQuery({ queryKey: sessionQueryKey, queryFn: getSession, retry: false });
  const logout = useMutation({ mutationFn: leaveSession, onSettled: () => { queryClient.clear(); void queryClient.invalidateQueries({ queryKey: sessionQueryKey }); } });
  return (
    <AppShell onLogout={session.isSuccess ? () => logout.mutate() : undefined}>
      {session.isPending ? <main className="mx-auto max-w-6xl px-5 py-12" role="status">Verificando acesso…</main> : session.isSuccess ? <HomePage /> : <AccessPage unavailable={session.error instanceof ApiError && session.error.status >= 500} />}
    </AppShell>
  );
}
