"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 transition-opacity duration-150 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md transform rounded-t-2xl bg-paper p-6 shadow-xl transition-transform duration-150 sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          {title ? (
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-fade hover:bg-ledger"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
