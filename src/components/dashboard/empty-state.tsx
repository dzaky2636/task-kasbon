import { ReceiptText } from "lucide-react";

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
      <button
        type="button"
        onClick={onCreate}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
      >
        + Catat baru
      </button>
    </div>
  );
}
