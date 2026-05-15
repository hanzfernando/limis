import { ChevronRight, Globe2, KeyRound, UserRound } from "lucide-react";
import type { VaultCredential } from "../../types/Vault";
import { cn } from "../../lib/utils";

interface CredentialCardProps {
  credential: VaultCredential;
  active?: boolean;
  onClick?: () => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative min-h-[9.5rem] w-full overflow-hidden rounded-lg border bg-card/90 p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary/60 bg-accent/45 shadow-sm"
          : "border-border hover:border-primary/45 hover:bg-accent/35"
      )}
    >
      <div className={cn("archive-line absolute left-4 right-4 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100", active && "opacity-100")} />
      <div className="flex items-start justify-between gap-3 text-foreground">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
            <KeyRound className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{credential.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">Guarded credential</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex min-w-0 items-center gap-2">
          <UserRound className="h-4 w-4 shrink-0 text-primary/80" />
          <span className="truncate">{credential.username || "No username saved"}</span>
        </div>
        {credential.url && (
          <div className="flex min-w-0 items-center gap-2">
            <Globe2 className="h-4 w-4 shrink-0 text-primary/80" />
            <span className="truncate">{credential.url.replace(/^https?:\/\//, "")}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Sealed in vault
      </div>
    </button>
  );
};

export default CredentialCard;
