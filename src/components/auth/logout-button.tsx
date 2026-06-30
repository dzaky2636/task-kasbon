"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/auth/logout")}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-fade hover:bg-ledger"
    >
      <LogOut size={16} />
      Keluar
    </button>
  );
}
