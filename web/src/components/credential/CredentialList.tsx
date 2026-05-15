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
    <div className="flex flex-wrap gap-4 mt-6">
      {credentials.map((cred, idx) => {
        const isLastOdd =
          credentials.length % 2 === 1 && idx === credentials.length - 1;

        return (
          <div
            key={idx}
            className={`${
              isLastOdd ? "w-full" : "w-full sm:w-[calc(50%-0.5rem)]"
            }`}
          >
            <CredentialCard credential={cred} onClick={() => onSelect?.(cred)} />
          </div>
        );
      })}
    </div>
  );
};

export default CredentialList;
