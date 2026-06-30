import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border bg-paper px-3 py-2.5 text-ink placeholder:text-fade/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20 transition-colors ${
          error ? "border-debt" : "border-fade/30"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-debt">{error}</p>}
    </div>
  );
}
