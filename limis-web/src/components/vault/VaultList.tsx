import type { Vault } from "../../types/Vault";
import VaultCard from "./VaultCard";

interface VaultListProps {
  vaults: Vault[];
}

const VaultList = ({ vaults }: VaultListProps) => {
  if (vaults.length === 0) {
    return <p className="text-sm text-[var(--color-muted)] mt-4">No vaults found.</p>;
  }

  return (
    <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
      {vaults.map((vault) => (
        <VaultCard
          key={vault.id}
          name={vault.name}
          description={vault.description}
          onClick={() => console.log("Open Vault", vault.id)}
        />
      ))}
    </div>
  );
};

export default VaultList;
