import { LockKeyhole } from "lucide-react";

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
      className="w-full rounded-lg border border-border bg-card p-4 text-left transition-colors duration-200 hover:border-primary/45 hover:bg-accent/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-2 flex items-center gap-3 text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
          <LockKeyhole className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      {desc && (
        <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
      )}
    </button>
  );
};

export default VaultCard;
