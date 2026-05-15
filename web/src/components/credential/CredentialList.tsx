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
      <p className="text-sm text-muted-foreground">
        No credentials yet. Add one when you are ready.
      </p>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      {credentials.map((cred, idx) => {
        const isLastOdd =
          credentials.length % 2 === 1 && idx === credentials.length - 1;

        return (
          <div
            key={cred.id || idx}
            className={isLastOdd ? "w-full" : "w-full sm:w-[calc(50%-0.5rem)]"}
          >
            <CredentialCard credential={cred} onClick={() => onSelect?.(cred)} />
          </div>
        );
      })}
    </div>
  );
};

export default CredentialList;
