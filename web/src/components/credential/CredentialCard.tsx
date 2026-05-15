import { KeyRound } from "lucide-react";
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
      className="w-full rounded-lg border border-border bg-card p-4 text-left transition-colors duration-200 hover:border-primary/45 hover:bg-accent/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-1 flex items-center gap-3 text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
          <KeyRound className="h-4 w-4" />
        </span>
        <p className="text-lg font-semibold">{credential.title}</p>
      </div>
      <p className="ml-11 text-sm text-muted-foreground">{credential.username}</p>
    </button>
  );
};

export default CredentialCard;
