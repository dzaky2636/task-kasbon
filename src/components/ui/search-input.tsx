import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export function SearchInput({
  placeholder = "Cari...",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fade"
      />
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full h-12 rounded-lg border border-fade/30 bg-paper py-0 pl-12 pr-4 text-base leading-none text-ink placeholder:text-fade/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
