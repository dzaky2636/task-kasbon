"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import type { Debt, DebtType } from "@/lib/types/debt";
import { useState } from "react";

interface DebtFormProps {
  mode: "create" | "edit";
  debt?: Debt;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  counterpart_name?: string;
  amount?: string;
  note?: string;
}

function parseAmount(formatted: string): number {
  const digits = formatted.replace(/\D/g, "");
  return digits === "" ? 0 : Number.parseInt(digits, 10);
}

function formatAmountInput(amount: number): string {
  if (amount === 0) return "";
  return new Intl.NumberFormat("id-ID").format(amount);
}

function todayInputValue(): string {
  return new Date().toISOString().split("T")[0];
}

export function DebtForm({ mode, debt, open, onClose, onSuccess }: DebtFormProps) {
  const [type, setType] = useState<DebtType>(debt?.type ?? "owed_to_me");
  const [counterpartName, setCounterpartName] = useState(debt?.counterpart_name ?? "");
  const [amountInput, setAmountInput] = useState(
    debt ? formatAmountInput(debt.amount) : "",
  );
  const [amount, setAmount] = useState(debt?.amount ?? 0);
  const [dueDate, setDueDate] = useState(debt?.due_date ?? todayInputValue());
  const [note, setNote] = useState(debt?.note ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseAmount(event.target.value);
    setAmount(raw);
    setAmountInput(formatAmountInput(raw));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (counterpartName.trim() === "") {
      nextErrors.counterpart_name = "Nama harus diisi";
    }

    if (amount <= 0) {
      nextErrors.amount = "Jumlah harus lebih dari 0";
    }

    if (note.length > 200) {
      nextErrors.note = "Catatan maksimal 200 karakter";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    const payload = {
      type,
      counterpart_name: counterpartName.trim(),
      amount,
      due_date: dueDate || undefined,
      note: note.trim() || undefined,
    };

    const url = mode === "edit" && debt ? `/api/debts/${debt.id}` : "/api/debts";
    const method = mode === "edit" ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setServerError(data.error ?? "Gagal menyimpan");
        setLoading(false);
        return;
      }

      toast(mode === "edit" ? "Catatan diupdate" : "Catatan disimpan", "success");
      onSuccess();
      onClose();
    } catch {
      setServerError("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit catatan" : "Catat baru"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="grid grid-cols-2 gap-3">
          <label
            className={`cursor-pointer rounded-xl border-2 px-3 py-4 text-center text-sm font-medium transition-colors has-checked:border-balance has-checked:bg-balance/10 has-checked:text-balance ${
              type === "owed_to_me"
                ? "border-balance bg-balance/10 text-balance"
                : "border-fade/20 bg-transparent text-ink hover:bg-ledger"
            }`}
          >
            <input
              type="radio"
              name="debt_type"
              value="owed_to_me"
              checked={type === "owed_to_me"}
              onChange={() => setType("owed_to_me")}
              className="sr-only"
            />
            Saya dihutang
          </label>
          <label
            className={`cursor-pointer rounded-xl border-2 px-3 py-4 text-center text-sm font-medium transition-colors has-checked:border-debt has-checked:bg-debt/10 has-checked:text-debt ${
              type === "i_owe"
                ? "border-debt bg-debt/10 text-debt"
                : "border-fade/20 bg-transparent text-ink hover:bg-ledger"
            }`}
          >
            <input
              type="radio"
              name="debt_type"
              value="i_owe"
              checked={type === "i_owe"}
              onChange={() => setType("i_owe")}
              className="sr-only"
            />
            Saya hutang
          </label>
        </fieldset>

        <Input
          label="Nama orang"
          placeholder="Nama orang"
          value={counterpartName}
          onChange={(event) => setCounterpartName(event.target.value)}
          error={errors.counterpart_name}
        />

        <div className="w-full space-y-1.5">
          <label className="block text-sm font-medium text-ink">Jumlah</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-fade">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amountInput}
              onChange={handleAmountChange}
              className={`w-full rounded-lg border bg-paper py-2.5 pl-9 pr-3 text-ink placeholder:text-fade/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20 transition-colors ${
                errors.amount ? "border-debt" : "border-fade/30"
              }`}
            />
          </div>
          {errors.amount && <p className="text-sm text-debt">{errors.amount}</p>}
        </div>

        <Input
          label="Tanggal"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />

        <div className="w-full space-y-1.5">
          <label className="block text-sm font-medium text-ink">Catatan</label>
          <textarea
            rows={3}
            placeholder="Opsional, maks 200 karakter"
            value={note}
            maxLength={200}
            onChange={(event) => setNote(event.target.value)}
            className="w-full resize-none rounded-lg border border-fade/30 bg-paper px-3 py-2.5 text-ink placeholder:text-fade/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20 transition-colors"
          />
          <div className="flex justify-end">
            <span className="text-xs text-fade">{note.length}/200</span>
          </div>
          {errors.note && <p className="text-sm text-debt">{errors.note}</p>}
        </div>

        {serverError && <p className="text-sm text-debt">{serverError}</p>}

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
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="flex-1"
          >
            {mode === "edit" ? "Simpan perubahan" : "Simpan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
