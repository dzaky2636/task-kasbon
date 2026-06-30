"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { useState } from "react";
import type { Debt } from "@/lib/types/debt";

interface DeleteConfirmProps {
  debt: Debt | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteConfirm({ debt, open, onClose, onSuccess }: DeleteConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!debt) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/debts/${debt.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Gagal menghapus");
        setLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Hapus catatan?">
      <div className="space-y-4">
        {debt && (
          <div className="rounded-xl bg-ledger p-3">
            <p className="font-medium text-ink">{debt.counterpart_name}</p>
            <p className="font-mono text-sm text-ink">
              {formatRupiah(debt.amount)}
            </p>
          </div>
        )}
        <p className="text-sm text-fade">
          Catatan ini akan dihapus permanen.
        </p>
        {error && <p className="text-sm text-debt">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            loading={loading}
            onClick={handleDelete}
            className="flex-1"
          >
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
