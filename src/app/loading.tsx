export default function DashboardLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-paper px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-20 animate-pulse rounded bg-ledger" />
        <div className="h-8 w-16 animate-pulse rounded bg-ledger" />
      </div>

      <section className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-ledger p-3">
          <div className="h-3 w-12 animate-pulse rounded bg-fade/20" />
          <div className="mt-2 h-6 w-full animate-pulse rounded bg-fade/20" />
        </div>
        <div className="rounded-xl bg-ledger p-3">
          <div className="h-3 w-12 animate-pulse rounded bg-fade/20" />
          <div className="mt-2 h-6 w-full animate-pulse rounded bg-fade/20" />
        </div>
        <div className="rounded-xl bg-ledger p-3">
          <div className="h-3 w-12 animate-pulse rounded bg-fade/20" />
          <div className="mt-2 h-6 w-full animate-pulse rounded bg-fade/20" />
        </div>
      </section>

      <div className="mb-3 flex items-center justify-between">
        <div className="h-4 w-16 animate-pulse rounded bg-ledger" />
        <div className="h-8 w-24 animate-pulse rounded bg-ledger" />
      </div>

      <div className="space-y-3 rounded-2xl border border-fade/10 bg-ledger/30 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="py-2">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-ledger" />
                <div className="h-3 w-32 animate-pulse rounded bg-ledger" />
              </div>
              <div className="h-5 w-20 animate-pulse rounded bg-ledger" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
