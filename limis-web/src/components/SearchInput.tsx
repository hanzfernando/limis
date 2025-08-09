import { FaSearch } from "react-icons/fa";
import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  ...rest
}: SearchInputProps) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--color-border)] 
        bg-[var(--color-surface)] text-[var(--color-foreground)] focus-within:ring-2 
        focus-within:ring-[var(--color-brand)] transition ${className}`}
    >
      <FaSearch className="text-[var(--color-muted)]" size={14} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none flex-1 text-sm placeholder:text-[var(--color-muted)]"
        {...rest}
      />
    </div>
  );
};

export default SearchInput;
