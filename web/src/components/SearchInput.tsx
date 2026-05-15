import { FaSearch } from "react-icons/fa";
import type { InputHTMLAttributes } from "react";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";

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
      className={cn(
        "flex items-center gap-2 rounded-md border border-input bg-card px-3 py-2 text-foreground focus-within:ring-2 focus-within:ring-ring",
        className
      )}
    >
      <FaSearch className="text-muted-foreground" size={14} />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={typeof placeholder === "string" ? placeholder : "Search"}
        className="h-auto border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
        {...rest}
      />
    </div>
  );
};

export default SearchInput;
