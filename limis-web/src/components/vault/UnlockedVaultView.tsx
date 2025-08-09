import { FiDatabase, FiPlus, FiTrash2 } from "react-icons/fi";
import type { Vault, VaultCredential } from "../../types/Vault";
import CredentialList from "../credential/CredentialList";

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
          <button
            onClick={onAddCredentialClick}
            className="flex items-center gap-2 bg-[var(--color-brand)] text-white px-4 py-2 rounded hover:bg-[var(--color-brand-hover)]"
          >
            <FiPlus />
            Add Credential
          </button>
        </div>

        <CredentialList credentials={credentials} onSelect={onSelect} />
      </section>

      <section className="border border-[var(--color-danger)] rounded-md p-4 mt-8 max-w-5xl mx-auto">
        <details>
          <summary className="text-[var(--color-danger)] font-semibold cursor-pointer">
            Danger Zone
          </summary>

          <div className="text-sm mt-4 text-[var(--color-muted)]">
            <p className="mb-2">
              Deleting this vault will permanently remove all credentials stored in it. This action cannot be undone.
            </p>
            <button
              onClick={onDeleteRequest}
              className="flex items-center gap-2 bg-[var(--color-danger)] text-white px-4 py-2 rounded hover:bg-[var(--color-danger-hover)]"
            >
              <FiTrash2 />
              Delete Vault
            </button>
          </div>
        </details>
      </section>
    </>
  );
};


export default UnlockedVaultView;
