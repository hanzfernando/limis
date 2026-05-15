import { Archive, Plus, Trash2 } from "lucide-react";
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
      <section className="mx-auto max-w-5xl space-y-4">
        <header className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
            <Archive className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium uppercase text-muted-foreground">Unlocked archive</p>
            <h1 className="text-3xl font-semibold">{vault.name}</h1>
          </div>
        </header>

        {vault.desc && <p className="text-muted-foreground">{vault.desc}</p>}

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Vault Entries</h3>
          <Button
            type="button"
            onClick={onAddCredentialClick}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Credential
          </Button>
        </div>

        <CredentialList credentials={credentials} onSelect={onSelect} />
      </section>

      <section className="mx-auto mt-8 max-w-5xl rounded-lg border border-destructive/35 bg-card/50 p-4">
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
            <Trash2 className="h-4 w-4" />
              Delete Vault
            </Button>
          </div>
        </details>
      </section>
    </>
  );
};


export default UnlockedVaultView;
