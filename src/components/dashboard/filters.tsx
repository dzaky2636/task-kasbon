"use client";

import { Select } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const statusOptions = [
  { value: "all", label: "Semua" },
  { value: "unsettled", label: "Belum Lunas" },
  { value: "settled", label: "Lunas" },
];

const typeOptions = [
  { value: "all", label: "Semua" },
  { value: "owed_to_me", label: "Dihutang" },
  { value: "i_owe", label: "Hutang" },
];

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        aria-label="Status"
        options={statusOptions}
        value={searchParams.get("status") ?? "all"}
        onChange={(event) => updateParam("status", event.target.value)}
        className="min-w-[130px] py-2 text-base"
      />
      <Select
        aria-label="Tipe"
        options={typeOptions}
        value={searchParams.get("type") ?? "all"}
        onChange={(event) => updateParam("type", event.target.value)}
        className="min-w-[130px] py-2 text-base"
      />
    </div>
  );
}
