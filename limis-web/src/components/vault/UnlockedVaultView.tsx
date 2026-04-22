import { FiDatabase, FiPlus, FiTrash2 } from "react-icons/fi";
import type { Vault, VaultCredential } from "../../types/Vault";
import CredentialList from "../credential/CredentialList";
import { Button } from "../ui/button";

type Props = {
  vault: Vault;
  credentials: VaultCredential[];
  onSelect: (cred: VaultCredential) => void;
  onDeleteRequest: () => void;
  onAddCredentialClick: () => void;
};


const UnlockedVaultView = ({
  vault,
  credentials,
  onSelect,
  onDeleteRequest,
  onAddCredentialClick
}: Props) => {
  return (
    <>
      <section className="space-y-4 max-w-5xl mx-auto">
        <header className="flex items-center gap-3">
          <FiDatabase className="text-xl text-[var(--color-brand)]" />
          <h1 className="text-3xl font-bold">{vault.name}</h1>
        </header>

        {vault.desc && <p className="text-[var(--color-muted)]">{vault.desc}</p>}

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Vault Entries</h3>
          <Button
            type="button"
            onClick={onAddCredentialClick}
            className="flex items-center gap-2"
          >
            <FiPlus />
            Add Credential
          </Button>
        </div>

        <CredentialList credentials={credentials} onSelect={onSelect} />
      </section>

      <section className="mt-8 max-w-5xl mx-auto rounded-md border border-destructive p-4">
        <details>
          <summary className="cursor-pointer font-semibold text-destructive">
            Danger Zone
          </summary>

          <div className="mt-4 text-sm text-muted-foreground">
            <p className="mb-2">
              Deleting this vault will permanently remove all credentials stored in it. This action cannot be undone.
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteRequest}
              className="flex items-center gap-2"
            >
              <FiTrash2 />
              Delete Vault
            </Button>
          </div>
        </details>
      </section>
    </>
  );
};


export default UnlockedVaultView;
