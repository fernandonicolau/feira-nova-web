import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a className="flex items-center gap-3 font-semibold" href="/">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-sm text-primary-foreground shadow-sm">FN</span>
            <span><span className="block text-base leading-tight">Feira Nova</span><span className="block text-xs font-normal text-muted-foreground">Central de pedidos</span></span>
          </a>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-strong">Operação online</span>
        </div>
      </header>
      {children}
    </div>
  );
}
