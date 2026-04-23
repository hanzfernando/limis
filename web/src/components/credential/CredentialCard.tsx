import { FaLock } from "react-icons/fa6";
import type { VaultCredential } from "../../types/Vault";

interface CredentialCardProps {
  credential: VaultCredential;
  onClick?: () => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-4 rounded-lg border border-[var(--color-border)] 
      bg-[var(--color-surface)] hover:shadow-md transition"
    >
      <div className="flex items-center gap-3 mb-1 text-[var(--color-foreground)]">
        <FaLock className="text-[var(--color-muted)]" size={16} />
        <p className="font-semibold text-lg">{credential.title}</p>
      </div>
      <p className="text-sm text-[var(--color-muted)]">{credential.username}</p>
    </div>
  );
};

export default CredentialCard;
