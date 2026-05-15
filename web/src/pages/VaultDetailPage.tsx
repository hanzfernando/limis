import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
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
import { deleteVaultThunk, fetchVaultDetailThunk, updateVaultMetadataThunk, updateVaultThunk } from "../state/thunks/vaultThunk";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { selectVaultDetailById, selectVaultError } from "../state/slices/vaultSlice";
import { Archive, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import EditVaultDetailsModal from "../components/vault/EditVaultDetailsModal";
import PageContainer from "../components/ui/page-container";

type VaultModalType = "delete-vault" | "edit-vault-details" | "add-credential" | "edit-credential" | "delete-credential" | null;


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
  const [editingVaultDetails, setEditingVaultDetails] = useState(false);
  const [editVaultError, setEditVaultError] = useState<string | null>(null);

  const vaultFromStore = useAppSelector((state) =>
    id ? selectVaultDetailById(state, id) : undefined
  );

  const reduxError = useAppSelector(selectVaultError);


  const [activeModal, setActiveModal] = useState<VaultModalType>(null);
  const [selectedCredential, setSelectedCredential] = useState<VaultCredential | null>(null);
  const [renderedCredential, setRenderedCredential] = useState<VaultCredential | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const detailPanelCloseTimeoutRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (detailPanelCloseTimeoutRef.current) {
      window.clearTimeout(detailPanelCloseTimeoutRef.current);
      detailPanelCloseTimeoutRef.current = null;
    }

    if (!selectedCredential) {
      setIsDetailPanelOpen(false);
      return;
    }

    setRenderedCredential(selectedCredential);
    const frame = window.requestAnimationFrame(() => setIsDetailPanelOpen(true));

    return () => window.cancelAnimationFrame(frame);
  }, [selectedCredential]);

  const closeDetailPanel = () => {
    setIsDetailPanelOpen(false);
    if (detailPanelCloseTimeoutRef.current) {
      window.clearTimeout(detailPanelCloseTimeoutRef.current);
    }

    detailPanelCloseTimeoutRef.current = window.setTimeout(() => {
      setSelectedCredential(null);
      setRenderedCredential(null);
      detailPanelCloseTimeoutRef.current = null;
    }, 320);
  };


  const handleDecrypt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

  const handleUpdateVaultDetails = async (payload: { name: string; desc?: string }) => {
    if (!vault) return;

    setEditingVaultDetails(true);
    setEditVaultError(null);

    try {
      const res = await dispatch(updateVaultMetadataThunk(vault.id, payload));

      if (res.success && "data" in res && res.data) {
        setVault(res.data);
        showToast("Vault details updated.", "success");
        closeModal();
        return;
      }

      const message = res.message || "Failed to update vault details.";
      setEditVaultError(message);
      showToast(message, "error");
    } catch (err) {
      console.error(err);
      const message = "Unexpected error while updating vault details.";
      setEditVaultError(message);
      showToast(message, "error");
    } finally {
      setEditingVaultDetails(false);
    }
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
        closeDetailPanel();
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
    const credentialToDelete = renderedCredential ?? selectedCredential;

    if (!vault || !password || !credentials || !credentialToDelete) {
      showToast("Password is required to update vault.", "error");
      return;
    }

    const updatedList = credentials.filter((c) => c.id !== credentialToDelete.id);

    try {
      const payload = await reencryptVault(vault.name, vault.desc || "", updatedList, password);
      const res = await dispatch(updateVaultThunk(vault.id, payload));

      if (res.success) {
        setCredentials(updatedList);
        setVault((prev) => (prev ? { ...prev, ...payload } : prev));
        showToast("Credential deleted successfully.", "success");
        closeDetailPanel();
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
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="archive-surface flex items-center gap-3 rounded-lg bg-card/85 px-5 py-4 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Loading sealed archive...
        </div>
      </div>
    );
  }
  if (reduxError) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="archive-surface max-w-md rounded-lg bg-card/85 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold">Archive unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">{reduxError}</p>
          <Button type="button" variant="outline" className="mt-5" onClick={() => navigate("/vaults")}>
            Back to archive
          </Button>
        </div>
      </div>
    );
  }
  if (!vault) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="archive-surface max-w-md rounded-lg bg-card/85 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
            <Archive className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold">Vault not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This archive may have been moved or removed.
          </p>
          <Button type="button" variant="outline" className="mt-5" onClick={() => navigate("/vaults")}>
            Back to archive
          </Button>
        </div>
      </div>
    );
  }



  return (
    <>
    <PageContainer>
        {!credentials ? (
          <LockedVaultView
            vault={vault}
            password={password}
            setPassword={setPassword}
            decrypting={decrypting}
            decryptError={decryptError}
            onDecrypt={handleDecrypt}
            onEditDetails={() => openModal("edit-vault-details")}
          />
        ) : (
          <UnlockedVaultView
            vault={vault}
            credentials={credentials}
            onSelect={setSelectedCredential}
            selectedCredentialId={renderedCredential?.id}
            onAddCredentialClick={() => openModal("add-credential")}
            onDeleteRequest={() => openModal("delete-vault")}
            onEditDetails={() => openModal("edit-vault-details")}
          />
        )}
    </PageContainer>
      {/* Backdrop — desktop only, dims the main content when panel is open */}
      {renderedCredential && (
        <div
          aria-hidden="true"
          onClick={closeDetailPanel}
          className={`
            hidden lg:block
            fixed inset-0 z-30
            bg-black/20 backdrop-blur-[1px]
            transition-opacity duration-300
            ${isDetailPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        />
      )}

      {/* Slide-in Panel — slides up from bottom on mobile, in from right on desktop */}
      {renderedCredential && (
        <div
          className={`
            fixed z-40
            inset-x-0 bottom-0 max-h-[82vh]
            border-t border-border bg-card/95 shadow-2xl backdrop-blur-xl
            lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:h-full lg:max-h-none lg:w-[27rem] lg:border-l lg:border-t-0
            transform-gpu transition-transform duration-300 ease-out
            ${isDetailPanelOpen
              ? "translate-y-0 lg:translate-y-0 lg:translate-x-0"
              : "translate-y-full lg:translate-y-0 lg:translate-x-full"
            }
          `}
        >
          <CredentialDetailPanel
            credential={renderedCredential}
            onClose={closeDetailPanel}
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

      {activeModal === "edit-vault-details" && (
        <EditVaultDetailsModal
          isOpen
          vault={vault}
          onClose={closeModal}
          onSubmit={handleUpdateVaultDetails}
          isSubmitting={editingVaultDetails}
          error={editVaultError}
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
        renderedCredential &&
      (
        <EditCredentialModal
          isOpen
          onClose={closeModal}
          onSave={handleUpdateCredential} 
          initialData={renderedCredential}
          />
      )}

      {
        activeModal === "delete-credential" && 
        renderedCredential &&
      (
        <ConfirmDeleteModal
          isOpen
          title={renderedCredential.title}
          onClose={closeModal}
          onConfirm={handleDeleteCredential}
        />
      )}

    </>

  );
};

export default VaultDetailPage;