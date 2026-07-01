"use client";

import { BarChart } from "@/components/dashboard/bar-chart";
import { DebtList } from "@/components/dashboard/debt-list";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { DebtForm } from "@/components/debt-form/debt-form";
import { DeleteConfirm } from "@/components/debt-form/delete-confirm";
import { toast, ToastContainer } from "@/components/ui/toast";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import type { Debt } from "@/lib/types/debt";
import { ChevronDown, ChevronUp, Layers, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface DashboardClientProps {
  debts: Debt[];
  error: string;
}

const sortOptions = [
  { value: "date-desc", label: "Terbaru" },
  { value: "date-asc", label: "Terlama" },
  { value: "amount-desc", label: "Jumlah terbesar" },
  { value: "amount-asc", label: "Jumlah terkecil" },
];

export function DashboardClient({ debts, error }: DashboardClientProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedDebt, setSelectedDebt] = useState<Debt | undefined>(undefined);
  const [deleteDebt, setDeleteDebt] = useState<Debt | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [settleError, setSettleError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [groupBy, setGroupBy] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filtered = useMemo(() => {
    let result = debts;

    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter((debt) =>
        debt.counterpart_name.toLowerCase().includes(query),
      );
    }

    return result.sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "amount-desc") {
        return b.amount - a.amount;
      }
      if (sortBy === "amount-asc") {
        return a.amount - b.amount;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [debts, debouncedQuery, sortBy]);

  const grouped = useMemo(() => {
    if (!groupBy) return null;
    const groups = new Map<string, Debt[]>();
    for (const debt of filtered) {
      const existing = groups.get(debt.counterpart_name) ?? [];
      existing.push(debt);
      groups.set(debt.counterpart_name, existing);
    }
    return Array.from(groups.entries()).map(([name, items]) => ({
      name,
      items,
      total: items
        .filter((d) => d.settled_at === null)
        .reduce((sum, d) => sum + d.amount, 0),
    }));
  }, [filtered, groupBy]);

  function toggleGroup(name: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

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

  const handleSettle = useCallback(
    async (debt: Debt) => {
      setSettleError("");

      try {
        const response = await fetch(`/api/debts/${debt.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settled_at: new Date().toISOString() }),
        });

        if (response.ok) {
          toast("Ditandai lunas", "success");
          router.refresh();
        } else {
          setSettleError("Gagal tandai lunas, coba lagi");
          toast("Gagal tandai lunas", "error");
        }
      } catch {
        setSettleError("Gagal tandai lunas, coba lagi");
        toast("Gagal tandai lunas", "error");
      }
    },
    [router],
  );

  const handleUnsettle = useCallback(
    async (debt: Debt) => {
      setSettleError("");

      try {
        const response = await fetch(`/api/debts/${debt.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settled_at: null }),
        });

        if (response.ok) {
          toast("Dibatalkan", "success");
          router.refresh();
        } else {
          setSettleError("Gagal batalkan lunas, coba lagi");
          toast("Gagal batalkan lunas", "error");
        }
      } catch {
        setSettleError("Gagal batalkan lunas, coba lagi");
        toast("Gagal batalkan lunas", "error");
      }
    },
    [router],
  );

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
      <ToastContainer />

      <BarChart debts={debts} />

      <div className="my-4 flex items-center gap-3">
        <SearchInput
          placeholder="Cari nama..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="min-w-0 flex-1"
        />
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="h-12 min-w-[130px] py-0 text-base leading-none"
        />
        <button
          type="button"
          onClick={() => setGroupBy(!groupBy)}
          className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            groupBy
              ? "border-ink bg-ink/5 text-ink"
              : "border-fade/30 text-fade hover:bg-ledger"
          }`}
          aria-label="Kelompokkan"
        >
          <Layers size={18} />
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-fade">Riwayat</h2>
        <Button variant="primary" size="sm" onClick={handleCreate}>
          <Plus size={16} />
          Catat baru
        </Button>
      </div>

      {settleError && (
        <p className="mb-3 rounded-lg bg-debt/10 px-4 py-2 text-sm text-debt">
          {settleError}
        </p>
      )}

      {groupBy && grouped ? (
        <div className="divide-y divide-fade/10 rounded-2xl border border-fade/10 bg-ledger/30 px-4">
          {grouped.map((group) => {
            const isExpanded = expandedGroups.has(group.name);
            const unsettledCount = group.items.filter(
              (d) => d.settled_at === null,
            ).length;

            return (
              <div key={group.name}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="flex w-full items-center justify-between py-3 text-left"
                >
                  <div>
                    <p className="font-semibold text-ink">{group.name}</p>
                    <p className="text-sm text-fade">
                      {group.items.length} entry
                      {unsettledCount > 0 && (
                        <span className="ml-1">
                          · {formatRupiah(group.total)}
                        </span>
                      )}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-fade" />
                  ) : (
                    <ChevronDown size={16} className="text-fade" />
                  )}
                </button>
                {isExpanded && (
                  <div className="pb-2">
                    {group.items.map((debt) => (
                      <DebtList
                        key={debt.id}
                        debts={[debt]}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSettle={handleSettle}
                        onUnsettle={handleUnsettle}
                        onCreate={handleCreate}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <DebtList
          debts={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSettle={handleSettle}
          onUnsettle={handleUnsettle}
          onCreate={handleCreate}
        />
      )}

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
