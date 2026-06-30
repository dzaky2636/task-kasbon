"use client";

import { Button } from "@/components/ui/button";
import { ReceiptText, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ReceiptText size={48} className="mb-4 text-fade/40" />
      <h3 className="text-base font-medium text-ink">Belum ada catatan nih</h3>
      <p className="mt-1 text-sm text-fade">
        Yuk catat utang piutang pertama kamu
      </p>
      <Button variant="primary" size="md" onClick={onCreate}>
        <Plus size={16} />
        Catat baru
      </Button>
    </div>
  );
}
