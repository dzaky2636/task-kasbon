import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { Debt } from "@/lib/types/debt";

interface SummaryCardsProps {
  debts: Debt[];
}

export function SummaryCards({ debts }: SummaryCardsProps) {
  const owedToMe = debts
    .filter((debt) => debt.type === "owed_to_me" && debt.settled_at === null)
    .reduce((sum, debt) => sum + debt.amount, 0);

  const iOwe = debts
    .filter((debt) => debt.type === "i_owe" && debt.settled_at === null)
    .reduce((sum, debt) => sum + debt.amount, 0);

  const net = owedToMe - iOwe;
  const isPositive = net >= 0;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl bg-ledger p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-fade">
          Dihutang ke saya
        </p>
        <p className="mt-1 font-mono text-lg font-semibold text-balance">
          {formatRupiah(owedToMe)}
        </p>
      </div>
      <div className="rounded-xl bg-ledger p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-fade">
          Saya hutang
        </p>
        <p className="mt-1 font-mono text-lg font-semibold text-debt">
          {formatRupiah(iOwe)}
        </p>
      </div>
      <div className="rounded-xl bg-ledger p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-fade">
          Net
        </p>
        <p
          className={`mt-1 font-mono text-lg font-semibold ${
            isPositive ? "text-balance" : "text-debt"
          }`}
        >
          {formatRupiah(net)}
        </p>
      </div>
    </div>
  );
}
