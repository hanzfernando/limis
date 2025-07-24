import { FaLock } from "react-icons/fa6";

interface VaultCardProps {
  name: string;
  description?: string;
  onClick?: () => void;
}

const VaultCard = ({ name, description, onClick }: VaultCardProps) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-4 rounded-lg border border-[var(--color-border)] 
      bg-[var(--color-surface)] hover:shadow-md transition"
    >
      <div className="flex items-center gap-3 mb-2 text-[var(--color-foreground)]">
        <FaLock className="text-[var(--color-muted)]" size={16} />
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>
      {description && (
        <p className="text-sm text-[var(--color-muted)]">{description}</p>
      )}
    </div>
  );
};

export default VaultCard;
