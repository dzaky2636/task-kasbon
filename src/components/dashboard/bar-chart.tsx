import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { Debt } from "@/lib/types/debt";

interface BarChartProps {
  debts: Debt[];
}

export function BarChart({ debts }: BarChartProps) {
  const owedToMe = debts
    .filter((debt) => debt.type === "owed_to_me" && debt.settled_at === null)
    .reduce((sum, debt) => sum + debt.amount, 0);

  const iOwe = debts
    .filter((debt) => debt.type === "i_owe" && debt.settled_at === null)
    .reduce((sum, debt) => sum + debt.amount, 0);

  const max = Math.max(owedToMe, iOwe, 1);
  const owedWidth = Math.round((owedToMe / max) * 100);
  const oweWidth = Math.round((iOwe / max) * 100);

  return (
    <div className="rounded-2xl border border-fade/10 bg-ledger/30 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-fade">
        <div className="h-2 w-2 rounded-full bg-balance" />
        Dihutang ke saya
        <span className="ml-auto font-mono text-sm text-ink">
          {formatRupiah(owedToMe)}
        </span>
      </div>
      <div className="mb-1 h-3 w-full overflow-hidden rounded-full bg-ledger">
        <div
          className="h-full rounded-full bg-balance transition-all duration-500"
          style={{ width: `${owedWidth}%` }}
        />
      </div>

      <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-fade">
        <div className="h-2 w-2 rounded-full bg-debt" />
        Saya hutang
        <span className="ml-auto font-mono text-sm text-ink">
          {formatRupiah(iOwe)}
        </span>
      </div>
      <div className="mb-1 h-3 w-full overflow-hidden rounded-full bg-ledger">
        <div
          className="h-full rounded-full bg-debt transition-all duration-500"
          style={{ width: `${oweWidth}%` }}
        />
      </div>
    </div>
  );
}
