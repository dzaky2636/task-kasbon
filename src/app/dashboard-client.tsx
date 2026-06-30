"use client";

import { DebtList } from "@/components/dashboard/debt-list";
import { Button } from "@/components/ui/button";
import { DebtForm } from "@/components/debt-form/debt-form";
import { DeleteConfirm } from "@/components/debt-form/delete-confirm";
import type { Debt } from "@/lib/types/debt";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardClientProps {
  debts: Debt[];
  error: string;
}

export function DashboardClient({ debts, error }: DashboardClientProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedDebt, setSelectedDebt] = useState<Debt | undefined>(undefined);
  const [deleteDebt, setDeleteDebt] = useState<Debt | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [settleError, setSettleError] = useState("");

  function handleCreate() {
    setFormMode("create");
    setSelectedDebt(undefined);
    setFormKey((key) => key + 1);
    setFormOpen(true);
  }

  function handleEdit(debt: Debt) {
    setFormMode("edit");
    setSelectedDebt(debt);
    setFormKey((key) => key + 1);
    setFormOpen(true);
  }

  function handleDelete(debt: Debt) {
    setDeleteDebt(debt);
  }

  async function handleSettle(debt: Debt) {
    setSettleError("");

    try {
      const response = await fetch(`/api/debts/${debt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settled_at: new Date().toISOString() }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        setSettleError("Gagal tandai lunas, coba lagi");
      }
    } catch {
      setSettleError("Gagal tandai lunas, coba lagi");
    }
  }

  function handleSuccess() {
    router.refresh();
  }

  if (error) {
    return (
      <div className="rounded-xl bg-debt/10 p-6 text-center">
        <p className="text-ink">{error}</p>
        <Button
          variant="secondary"
          size="md"
          onClick={() => router.refresh()}
          className="mt-3"
        >
          Coba lagi
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-fade">Riwayat</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreate}
        >
          <Plus size={16} />
          Catat baru
        </Button>
      </div>

      {settleError && (
        <p className="mb-3 rounded-lg bg-debt/10 px-4 py-2 text-sm text-debt">
          {settleError}
        </p>
      )}

      <DebtList
        debts={debts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSettle={handleSettle}
        onCreate={handleCreate}
      />

      <DebtForm
        key={formKey}
        mode={formMode}
        debt={selectedDebt}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={handleSuccess}
      />

      <DeleteConfirm
        debt={deleteDebt}
        open={deleteDebt !== null}
        onClose={() => setDeleteDebt(null)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
