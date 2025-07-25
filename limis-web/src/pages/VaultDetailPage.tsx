import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { VaultDetail, VaultCredential } from "../types/Vault";
import { getVaultById, updateVault, deleteVaultById } from "../service/vaultService";
import { decryptVaultData, reencryptVault } from "../utils/cryptoUtils";
import LockedVaultView from "../components/vault/LockedVaultView";
import UnlockedVaultView from "../components/vault/UnlockedVaultView";
import CredentialDetailPanel from "../components/credential/CredentialDetailPanel";
import ConfirmDeleteVaultModal from "../components/ConfirmDeleteVaultModal";
import AddCredentialModal from "../components/credential/AddCredentialModal";
import { showToast } from "../utils/showToast";

type VaultModalType = "delete-vault" | "add-credential" | null;


const VaultDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vault, setVault] = useState<VaultDetail | null>(null);
  const [credentials, setCredentials] = useState<VaultCredential[] | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState("");

  const [activeModal, setActiveModal] = useState<VaultModalType>(null);
  const [selectedCredential, setSelectedCredential] = useState<VaultCredential | null>(null);

  const openModal = (type: Exclude<VaultModalType, null>) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (!id) return;
    const fetchVault = async () => {
      try {
        const res = await getVaultById(id);
        if (res.success && res.data) setVault(res.data);
        else setError(res.message || "Vault not found.");
      } catch (err) {
        console.error(err);
        setError("Error fetching vault.");
      } finally {
        setLoading(false);
      }
    };
    fetchVault();
  }, [id]);

  const handleDecrypt = async () => {
    if (!vault) return;
    setDecrypting(true);
    try {
      const decrypted = await decryptVaultData(vault.ciphertext, vault.iv, vault.salt, password);
      setCredentials(Array.isArray(decrypted) ? decrypted : []);
      setDecryptError("");
    } catch (err) {
      console.error("Decryption failed:", err);
      setDecryptError("Invalid password or corrupt data.");
    } finally {
      setDecrypting(false);
    }
  };

  const handleDeleteVault = async () => {
    if (!vault) return;

    try {
      const res = await deleteVaultById(vault.id);

      if (!res || !res.success) {
        showToast(`Failed to delete "${vault.name}" vault.`, "error");
      }

      showToast(`Vault "${vault.name}" deleted.`, "success");
      navigate("/vaults");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Vault deletion failed:", err);
      alert(err.message || "Vault deletion failed.");
    } finally {
      closeModal();
    }
  };


  const handleAddCredential = async (newCredential: VaultCredential) => {
    if (!vault || !password) return;
    const updated = [...(credentials || []), newCredential];
    try {
      const payload = await reencryptVault(vault.name, vault.desc || "", updated, password);
      const res = await updateVault(vault.id, payload);
      if (res.success) {
        setCredentials(updated);
        setVault((prev) => (prev ? { ...prev, ...payload } : prev));
      } else {
        alert("Failed to update vault: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Vault update failed.");
    } finally {
      closeModal();
    }
  };

  if (loading) return <p className="p-6">Loading vault...</p>;
  if (error || !vault) return <p className="p-6 text-red-500">{error || "Vault not found."}</p>;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <div className="flex-1 mt-12 p-6 space-y-6 overflow-x-hidden">
       

        {!credentials ? (
          <LockedVaultView
          vault={vault}
            password={password}
            setPassword={setPassword}
            decrypting={decrypting}
            decryptError={decryptError}
            onDecrypt={handleDecrypt}
          />
        ) : (
          <UnlockedVaultView
            vault={vault}
            credentials={credentials}
            onSelect={setSelectedCredential}
            onAddCredentialClick={() => openModal("add-credential")}
            onDeleteRequest={() => openModal("delete-vault")}
          />

        )}
      </div>
      {/* Slide-in Panel */}
      {selectedCredential && (
        <div
          className={`
            lg:static lg:w-[24rem] lg:flex-shrink-0
            bg-[var(--color-surface)] border-t lg:border-t-0 lg:border-l border-[var(--color-border)] shadow-xl
            transform transition-transform duration-300 ease-in-out
            ${selectedCredential ? "translate-y-0" : "translate-y-full"}
            lg:translate-y-0
            md:h-[70%] lg:h-auto
            z-40
          `}
        >
          
            <CredentialDetailPanel
              credential={selectedCredential}
              onClose={() => setSelectedCredential(null)}
            />
          
        </div>
      )}

      {activeModal === "delete-vault" && (
        <ConfirmDeleteVaultModal
          isOpen
          onClose={closeModal}
          onConfirm={handleDeleteVault}
          vaultName={vault.name}
        />
      )}

      {activeModal === "add-credential" && (
        <AddCredentialModal
          isOpen
          onClose={closeModal}
          onSave={handleAddCredential}
        />
      )}

    </div>
  );
};

export default VaultDetailPage;
