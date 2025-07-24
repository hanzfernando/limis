import { FiDatabase, FiPlus } from "react-icons/fi";
import type { Vault, VaultCredential } from "../../types/Vault";
import CredentialList from "../credential/CredentialList";
import AddCredentialModal from "../credential/AddCredentialModal";

type Props = {
  vault: Vault
  credentials: VaultCredential[];
  showModal: boolean;
  onAdd: (newCred: VaultCredential) => void;
  onSelect: (cred: VaultCredential) => void;
  onModalToggle: (state: boolean) => void;
};

const UnlockedVaultView = ({
  vault,
  credentials,
  showModal,
  onAdd,
  onSelect,
  onModalToggle,
}: Props) => (
  <>
    <section className="space-y-4 max-w-5xl mx-auto ">
       <header className="flex items-center gap-3">
          <FiDatabase className="text-xl text-[var(--color-brand)]" />
          <h1 className="text-3xl font-bold">{vault.name}</h1>
        </header>

        {vault.desc && <p className="ml-7 text-[var(--color-muted)]">{vault.desc}</p>}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vault Entries</h3>
        <button
          onClick={() => onModalToggle(true)}
          className="flex items-center gap-2 bg-[var(--color-brand)] text-white px-4 py-2 rounded hover:bg-[var(--color-brand-hover)]"
        >
          <FiPlus />
          Add Credential
        </button>
      </div>

      <CredentialList credentials={credentials} onSelect={onSelect} />
    </section>

    <AddCredentialModal
      isOpen={showModal}
      onClose={() => onModalToggle(false)}
      onSave={onAdd}
    />
  </>
);

export default UnlockedVaultView;
