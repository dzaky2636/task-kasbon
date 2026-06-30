"use client";

import type { Debt } from "@/lib/types/debt";
import { DebtRow } from "./debt-row";
import { EmptyState } from "./empty-state";

interface DebtListProps {
  debts: Debt[];
  onEdit: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
  onSettle: (debt: Debt) => void;
  onCreate: () => void;
}

export function DebtList({
  debts,
  onEdit,
  onDelete,
  onSettle,
  onCreate,
}: DebtListProps) {
  if (debts.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <div className="divide-y divide-fade/10 rounded-2xl border border-fade/10 bg-ledger/30 px-4">
      {debts.map((debt) => (
        <DebtRow
          key={debt.id}
          debt={debt}
          onEdit={onEdit}
          onDelete={onDelete}
          onSettle={onSettle}
        />
      ))}
    </div>
  );
}
