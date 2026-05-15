import { ChevronRight, LockKeyhole } from "lucide-react";

interface VaultCardProps {
  name: string;
  desc?: string;
  onClick?: () => void;
}

const VaultCard = ({ name, desc, onClick }: VaultCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg border border-border bg-card/90 p-4 text-left transition-colors duration-200 hover:border-primary/45 hover:bg-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="archive-line absolute left-4 right-4 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="mb-2 flex items-center justify-between gap-3 text-foreground">
        <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
          <LockKeyhole className="h-4 w-4" />
        </span>
          <h3 className="truncate text-lg font-semibold">{name}</h3>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      {desc && (
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{desc}</p>
      )}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Sealed archive
      </div>
    </button>
  );
};

export default VaultCard;
