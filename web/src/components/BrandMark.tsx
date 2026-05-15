import { cn } from "../lib/utils";

type BrandMarkProps = {
  className?: string;
  showWordmark?: boolean;
};

export default function BrandMark({ className, showWordmark = true }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="flex p-1 h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary shadow-sm">
        <img src="/auri_logo.png"></img>
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-xl font-thin normal-case text-foreground">Limis</span>
          <span className="mt-1 text-[0.65rem] font-medium uppercase text-muted-foreground tracking-wider">
            Guarded by Auri
          </span>
        </span>
      )}
    </span>
  );
}
