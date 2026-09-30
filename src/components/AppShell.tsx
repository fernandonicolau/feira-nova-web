import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-emerald-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a className="flex items-center gap-3 font-semibold" href="/">
            <span className="grid size-10 place-items-center rounded-2xl bg-emerald-700 text-sm text-white shadow-sm">
              FN
            </span>
            <span>
              <span className="block text-base leading-tight">Feira Nova</span>
              <span className="block text-xs font-normal text-slate-500">Central de pedidos</span>
            </span>
          </a>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            Fundação Web
          </span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
