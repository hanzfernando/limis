import { cn } from "../lib/utils";

type BrandMarkProps = {
  className?: string;
  showWordmark?: boolean;
};

export default function BrandMark({ className, showWordmark = true }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary shadow-sm">
        <svg
          viewBox="0 0 48 48"
          className="h-7 w-7"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 18L24 10L36 18V29C36 36 31 40.5 24 42C17 40.5 12 36 12 29V18Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M16 20.5C18.3 16.7 21.8 16.7 24 21C26.2 16.7 29.7 16.7 32 20.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="19.5" cy="24.5" r="1.8" fill="currentColor" />
          <circle cx="28.5" cy="24.5" r="1.8" fill="currentColor" />
          <path d="M24 27L21 31H27L24 27Z" fill="currentColor" />
          <path
            d="M20 34H28"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-xl font-semibold normal-case text-foreground">Limis</span>
          <span className="mt-1 text-[0.65rem] font-medium uppercase text-muted-foreground">
            Guarded by Auri
          </span>
        </span>
      )}
    </span>
  );
}
