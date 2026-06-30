import { Filters } from "@/components/dashboard/filters";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/lib/supabase/server";
import type { Debt, DebtStatusFilter, DebtTypeFilter } from "@/lib/types/debt";
import { DashboardClient } from "./dashboard-client";

interface DashboardPageProps {
  searchParams: Promise<{ status?: string; type?: string }>;
}

function matchesStatus(debt: Debt, status: DebtStatusFilter): boolean {
  if (status === "all") return true;
  const isSettled = debt.settled_at !== null;
  return status === "settled" ? isSettled : !isSettled;
}

function matchesType(debt: Debt, type: DebtTypeFilter): boolean {
  if (type === "all") return true;
  return debt.type === type;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const statusFilter: DebtStatusFilter =
    params.status === "settled" || params.status === "unsettled"
      ? params.status
      : "all";
  const typeFilter: DebtTypeFilter =
    params.type === "owed_to_me" || params.type === "i_owe" ? params.type : "all";

  let debts: Debt[] = [];
  let error = "";

  try {
    const supabase = await createClient();
    const { data, error: fetchError } = await supabase
      .from("debts")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      error = "Gagal memuat data";
    } else {
      debts = (data ?? []).filter(
        (debt: Debt) =>
          matchesStatus(debt, statusFilter) && matchesType(debt, typeFilter),
      );
    }
  } catch {
    error = "Gagal memuat data";
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-paper px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink">Kasbon</h1>
        <LogoutButton />
      </header>

      <section className="mb-4">
        <SummaryCards debts={debts} />
      </section>

      <DashboardClient debts={debts} error={error} />

      <section className="mt-4">
        <Filters />
      </section>
    </main>
  );
}
