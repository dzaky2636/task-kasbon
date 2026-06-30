import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-paper">
      <div className="w-full max-w-[360px] rounded-2xl border border-fade/20 bg-ledger p-6 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-fade">
            Kasbon
          </p>
          <h1 className="mt-2 text-xl font-semibold text-ink">Masuk</h1>
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-fade">
          Belum punya akun?{" "}
          <Link href="/signup" className="font-medium text-ink hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  );
}
