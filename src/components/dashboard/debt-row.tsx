"use client";

import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { relativeTime } from "@/lib/utils/relative-time";
import { CheckCircle, Pencil, Trash2, XCircle } from "lucide-react";
import type { Debt } from "@/lib/types/debt";

interface DebtRowProps {
  debt: Debt;
  onEdit: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
  onSettle: (debt: Debt) => void;
  onUnsettle: (debt: Debt) => void;
}

function typeLabel(type: Debt["type"]): string {
  return type === "owed_to_me" ? "Dihutang ke saya" : "Saya hutang";
}

export function DebtRow({ debt, onEdit, onDelete, onSettle, onUnsettle }: DebtRowProps) {
  const isSettled = debt.settled_at !== null;

  return (
    <div className="border-b border-fade/15 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-ink">
            {debt.counterpart_name}
          </p>
          <p className="mt-0.5 text-xs text-fade">
            {typeLabel(debt.type)} · {relativeTime(debt.due_date ?? debt.created_at)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-base font-semibold text-ink">
            {formatRupiah(debt.amount)}
          </p>
          <span
            className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              isSettled
                ? "bg-balance/10 text-balance"
                : "bg-ledger text-ink"
            }`}
          >
            {isSettled ? "Lunas" : "Belum Lunas"}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {!isSettled && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSettle(debt)}
            className="h-8"
          >
            <CheckCircle size={14} />
            Tandai Lunas
          </Button>
        )}
        {isSettled && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUnsettle(debt)}
            className="h-8"
          >
            <XCircle size={14} />
            Batal Lunas
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(debt)}
          className="h-8"
        >
          <Pencil size={14} />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(debt)}
          className="h-8 text-debt hover:bg-debt/10 hover:text-debt"
        >
          <Trash2 size={14} />
          Hapus
        </Button>
      </div>
    </div>
  );
}
