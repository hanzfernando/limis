import { ChevronRight, KeyRound } from "lucide-react";
import type { VaultCredential } from "../../types/Vault";

interface CredentialCardProps {
  credential: VaultCredential;
  onClick?: () => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg border border-border bg-card/90 p-4 text-left transition-colors duration-200 hover:border-primary/45 hover:bg-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="archive-line absolute left-4 right-4 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="mb-1 flex items-center justify-between gap-3 text-foreground">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
            <KeyRound className="h-4 w-4" />
          </span>
          <p className="truncate text-lg font-semibold">{credential.title}</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <p className="ml-11 text-sm text-muted-foreground">{credential.username}</p>
    </button>
  );
};

export default CredentialCard;
