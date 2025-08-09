import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { VaultDetail, VaultCredential } from "../types/Vault";
import { decryptVaultData, reencryptVault } from "../utils/cryptoUtils";
import LockedVaultView from "../components/vault/LockedVaultView";
import UnlockedVaultView from "../components/vault/UnlockedVaultView";
import CredentialDetailPanel from "../components/credential/CredentialDetailPanel";
import ConfirmDeleteVaultModal from "../components/ConfirmDeleteVaultModal";
import AddCredentialModal from "../components/credential/AddCredentialModal";
import { showToast } from "../utils/showToast";
import EditCredentialModal from "../components/credential/EditCredentialModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { deleteVaultThunk, fetchVaultDetailThunk, updateVaultThunk } from "../state/thunks/vaultThunk";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { selectVaultDetailById, selectVaultError } from "../state/slices/vaultSlice";

type VaultModalType = "delete-vault" | "add-credential" | "edit-credential" | "delete-credential" |null;


const VaultDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  
  const { id } = useParams();
  const [vault, setVault] = useState<VaultDetail | null>(null);
  const [credentials, setCredentials] = useState<VaultCredential[] | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState("");

  const vaultFromStore = useAppSelector((state) =>
    id ? selectVaultDetailById(state, id) : undefined
  );

  const reduxError = useAppSelector(selectVaultError);


  const [activeModal, setActiveModal] = useState<VaultModalType>(null);
  const [selectedCredential, setSelectedCredential] = useState<VaultCredential | null>(null);

  const openModal = (type: Exclude<VaultModalType, null>) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  

  useEffect(() => {
    if (!id || vaultFromStore) return;
    dispatch(fetchVaultDetailThunk(id));
  }, [id, vaultFromStore, dispatch]);

  useEffect(() => {
    if (vaultFromStore) {
      setVault(vaultFromStore);
      setLoading(false);
    } else if (id && reduxError) {
      setLoading(false);
    }
  }, [vaultFromStore, reduxError, id]);



  useEffect(() => {
    if (!credentials) setSelectedCredential(null);
  }, [credentials]);


  const handleDecrypt = async () => {
    if (!vault || !password) {
      showToast("Password is required to update vault.", "error");
      return;
    }

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
  if (!vault || !password) {
    showToast("Password is required to update vault.", "error");
    return;
  }

  const res = await dispatch(deleteVaultThunk(vault.id));

  if (!res?.success) {
    showToast(`Failed to delete "${vault.name}" vault.`, "error");
    return;
  }

  showToast(`Vault "${vault.name}" deleted.`, "success");
  navigate("/vaults");
  closeModal();
};


  const handleAddCredential = async (newCredential: VaultCredential) => {
    if (!vault || !password) {
      showToast("Password is required to update vault.", "error");
      return;
    }
    const updated = [...(credentials || []), newCredential];
    try {
      const payload = await reencryptVault(vault.name, vault.desc || "", updated, password);
      const res = await dispatch(updateVaultThunk(vault.id, payload));

      if (res.success) {
        setCredentials(updated);
        setVault((prev) => (prev ? { ...prev, ...payload } : prev));
        showToast("Credential added successfully.", "success");
      } else {
        showToast("Failed to update credential.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update credential.", "error");
    } finally {
      closeModal();
    }
  };

  const handleUpdateCredential = async (updatedCredential: VaultCredential) => {
    if (!vault || !password || !credentials) {
      showToast("Password is required to update vault.", "error");
      return;
    }

    const updatedList = credentials.map((c) => 
      c.id === updatedCredential.id ? updatedCredential : c
    )

    try {
      const payload = await reencryptVault(vault.name, vault.desc || "", updatedList, password);
      const res = await dispatch(updateVaultThunk(vault.id, payload));

      if (res.success) {
        setCredentials(updatedList);
        setVault((prev) => (prev ? { ...prev, ...payload } : prev));
        showToast("Credential updated successfully.", "success");
        setSelectedCredential(null)
      } else {
        showToast("Failed to update credential.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update credential.", "error");
    } finally {
      closeModal();
    }
  }

  const handleDeleteCredential = async () => {
    if (!vault || !password || !credentials || !selectedCredential) {
      showToast("Password is required to update vault.", "error");
      return;
    }

    const updatedList = credentials.filter((c) => c.id !== selectedCredential.id);

    try {
      const payload = await reencryptVault(vault.name, vault.desc || "", updatedList, password);
      const res = await dispatch(updateVaultThunk(vault.id, payload));

      if (res.success) {
        setCredentials(updatedList);
        setVault((prev) => (prev ? { ...prev, ...payload } : prev));
        showToast("Credential deleted successfully.", "success");
        setSelectedCredential(null)
      } else {
        showToast("Failed to delete credential.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete credential.", "error");
    } finally {
      closeModal();
    }
  }


  if (loading) {
    return <p className="p-6">Loading vault...</p>;
  }
  if (reduxError) {
    return <p className="p-6 text-red-500">{reduxError}</p>;
  }
  if (!vault) {
    return <p className="p-6 text-red-500">Vault not found.</p>;
  }



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
              onEdit={() => {
                openModal("edit-credential");
              }}
              onDelete={() => {
                openModal("delete-credential");
              }}

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

      {
        activeModal === "edit-credential" && 
        selectedCredential &&
      (
        <EditCredentialModal
          isOpen
          onClose={closeModal}
          onSave={handleUpdateCredential} 
          initialData={selectedCredential}
          />
      )}

      {
        activeModal === "delete-credential" && 
        selectedCredential &&
      (
        <ConfirmDeleteModal
          isOpen
          title={selectedCredential.title}
          onClose={closeModal}
          onConfirm={handleDeleteCredential}
        />
      )}

    </div>
  );
};

export default VaultDetailPage;
