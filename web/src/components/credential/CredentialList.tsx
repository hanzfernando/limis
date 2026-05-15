import React from "react";
import CredentialCard from "./CredentialCard";
import type { VaultCredential } from "../../types/Vault";

interface CredentialListProps {
  credentials: VaultCredential[];
  selectedCredentialId?: string;
  onSelect?: (credential: VaultCredential) => void;
}

const CredentialList: React.FC<CredentialListProps> = ({ credentials, selectedCredentialId, onSelect }) => {
  if (credentials.length === 0) {
    return (
      <div className="archive-surface rounded-lg bg-card/70 p-8 text-center">
        <p className="text-sm font-medium">No records sealed here yet.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add the first credential when this archive is ready to hold it.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {credentials.map((cred, idx) => {
        return (
          <CredentialCard
            key={cred.id || idx}
            credential={cred}
            active={selectedCredentialId === cred.id}
            onClick={() => onSelect?.(cred)}
          />
        );
      })}
    </div>
  );
};

export default CredentialList;
