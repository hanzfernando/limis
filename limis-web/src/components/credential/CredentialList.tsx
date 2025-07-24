import React from "react";
import CredentialCard from "./CredentialCard";
import type { VaultCredential } from "../../types/Vault";

interface CredentialListProps {
  credentials: VaultCredential[];
  onSelect?: (credential: VaultCredential) => void;
}

const CredentialList: React.FC<CredentialListProps> = ({ credentials, onSelect }) => {
  if (credentials.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        No credentials yet. Click “Add Credential” to get started.
      </p>
    );
  }

  return (
    <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
      {credentials.map((cred, idx) => (
        <CredentialCard
          key={idx}
          credential={cred}
          onClick={() => onSelect?.(cred)}
        />
      ))}
    </div>
  );
};

export default CredentialList;
