import { DayInbox } from "../components/DayInbox";
import { NewBatchForm } from "../components/NewBatchForm";

export function HomePage() {
  return <main>
    <DayInbox />
    <section className="mx-auto max-w-5xl px-5 pb-14 sm:px-8">
      <details className="rounded-xl border border-border bg-surface p-5"><summary className="cursor-pointer text-sm font-semibold">Usar conversor anterior</summary><div className="mt-5"><NewBatchForm /></div></details>
    </section>
  </main>;
}
