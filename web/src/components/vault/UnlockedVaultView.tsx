import { Archive, KeyRound, Plus, ShieldCheck, Trash2 } from "lucide-react";
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
      <section className="mx-auto max-w-5xl space-y-5">
        <header className="archive-surface flex flex-col gap-4 rounded-lg bg-card/80 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
            <Archive className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium uppercase text-muted-foreground">Unlocked archive</p>
            <h1 className="text-3xl font-semibold">{vault.name}</h1>
          </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border bg-background/55 px-3 py-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Active session
          </div>
        </header>

        {vault.desc && <p className="text-muted-foreground">{vault.desc}</p>}

        <div className="flex items-center justify-between rounded-lg border border-border bg-card/70 p-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <KeyRound className="h-4 w-4 text-primary" />
              Vault entries
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{credentials.length} guarded items</p>
          </div>
          <Button
            type="button"
            onClick={onAddCredentialClick}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add credential
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
              Delete vault
            </Button>
          </div>
        </details>
      </section>
    </>
  );
};


export default UnlockedVaultView;
