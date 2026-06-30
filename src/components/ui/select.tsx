import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  options: SelectOption[];
  error?: string;
}

export function Select({ label, options, error, className = "", ...props }: SelectProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <select
        className={`w-full appearance-none rounded-lg border bg-paper px-3 py-2.5 text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20 transition-colors ${
          error ? "border-debt" : "border-fade/30"
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-debt">{error}</p>}
    </div>
  );
}
