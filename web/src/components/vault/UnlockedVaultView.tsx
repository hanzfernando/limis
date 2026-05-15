import { Archive, EyeOff, Fingerprint, KeyRound, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import type { Vault, VaultCredential } from "../../types/Vault";
import CredentialList from "../credential/CredentialList";
import { Button } from "../ui/button";

type Props = {
  vault: Vault;
  credentials: VaultCredential[];
  selectedCredentialId?: string;
  onSelect: (cred: VaultCredential) => void;
  onDeleteRequest: () => void;
  onAddCredentialClick: () => void;
  onEditDetails: () => void;
};


const UnlockedVaultView = ({
  vault,
  credentials,
  selectedCredentialId,
  onSelect,
  onDeleteRequest,
  onAddCredentialClick,
  onEditDetails
}: Props) => {
  return (
    <>
      <section className="mx-auto max-w-6xl space-y-5">
        <header className="archive-surface relative overflow-hidden rounded-lg bg-card/80 p-5">
          <div className="archive-line absolute left-8 right-8 top-0 h-px" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                <Archive className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium uppercase text-muted-foreground">Unlocked archive</p>
                <h1 className="truncate text-3xl font-semibold">{vault.name}</h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onEditDetails}>
                <Pencil className="h-4 w-4" />
                Edit details
              </Button>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background/55 px-3 py-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Active session
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background/55 px-3 py-2 text-sm text-muted-foreground">
                <EyeOff className="h-4 w-4 text-primary" />
                Private view
              </div>
            </div>
          </div>

          {vault.desc && (
            <p className="mt-5 max-w-3xl border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
              {vault.desc}
            </p>
          )}
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card/70 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <KeyRound className="h-4 w-4 text-primary" />
              Entries
            </div>
            <p className="mt-2 text-2xl font-semibold">{credentials.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card/70 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Fingerprint className="h-4 w-4 text-primary" />
              Vault identity
            </div>
            <p className="mt-2 truncate font-mono text-sm">{vault.id}</p>
          </div>
          <div className="rounded-lg border border-border bg-card/70 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Guard state
            </div>
            <p className="mt-2 text-sm font-medium">Locally decrypted</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <KeyRound className="h-4 w-4 text-primary" />
              Credential records
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Select a record to inspect it in the guarded side panel.</p>
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

        <CredentialList credentials={credentials} selectedCredentialId={selectedCredentialId} onSelect={onSelect} />
      </section>

      <section className="mx-auto mt-8 max-w-6xl rounded-lg border border-destructive/25 bg-destructive/5 p-4">
        <details>
          <summary className="cursor-pointer text-sm font-semibold text-destructive">
            Destructive archive controls
          </summary>

          <div className="mt-4 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl">
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
