import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiLock, FiPlus, FiDatabase } from "react-icons/fi";
import type { VaultDetail, VaultCredential } from "../types/Vault";
import { getVaultById, updateVault } from "../service/vaultService";
import { decryptVaultData, reencryptVault } from "../utils/cryptoUtils";
import AddCredentialModal from "../components/credential/AddCredentialModal";

const VaultDetailPage = () => {
  const { id } = useParams();
  const [vault, setVault] = useState<VaultDetail | null>(null);
  const [decryptedContent, setDecryptedContent] = useState<VaultCredential[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [passwordInput, setPasswordInput] = useState("");
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState("");

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchVault = async () => {
      setLoading(true);
      try {
        const res = await getVaultById(id);
        if (res.success && res.data) {
          setVault(res.data);
          console.log(res.data)
        } else {
          setError(res.message || "Vault not found");
        }
      } catch (err) {
        console.error("Error fetching vault:", err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchVault();
  }, [id]);

  const handleDecrypt = async () => {
    if (!vault) return;
    setDecrypting(true);
    setDecryptError("");

    try {
      const decrypted = await decryptVaultData(
        vault.ciphertext,
        vault.iv,
        vault.salt,
        passwordInput
      );

      if (Array.isArray(decrypted)) {
        setDecryptedContent(decrypted);
      } else {
        setDecryptedContent([]);
      }
    } catch (err) {
      console.error("Decryption failed:", err);
      setDecryptError("Invalid master password or corrupt data.");
    } finally {
      setDecrypting(false);
    }
  };

const handleAddCredential = async (newCredential: VaultCredential) => {
  if (!vault || !passwordInput) return;

  const updatedCredentials = decryptedContent ? [...decryptedContent, newCredential] : [newCredential];

  try {
    // Re-encrypt vault content
    const updatedPayload = await reencryptVault(
      vault.name,
      vault.desc || "",
      updatedCredentials,
      passwordInput
    );

    console.log(vault)
    console.log(updatedPayload)

    // Send to backend
    const res = await updateVault(vault.id, updatedPayload);

    if (res.success) {
      setDecryptedContent(updatedCredentials); // optimistic update
      setVault(prev => prev ? { ...prev, ...updatedPayload } : prev);
    } else {
      alert("Failed to update vault: " + res.message);
    }
  } catch (err) {
    console.error("Error reencrypting or updating vault:", err);
    alert("Failed to re-encrypt vault");
  } finally {
    setShowModal(false);
  }
};


  if (loading) return <p className="p-6">Loading vault...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!vault) return <p className="p-6">No vault found.</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FiDatabase className="text-xl text-[var(--color-brand)]" />
        <h1 className="text-3xl font-bold">{vault.name}</h1>
      </div>
      {vault.desc && (
        <p className="text-[var(--color-muted)] -mt-4 ml-7">{vault.desc}</p>
      )}

      {!decryptedContent ? (
        <div className="bg-[var(--color-surface)] p-4 rounded border border-[var(--color-border)] max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <FiLock className="text-lg" />
            <p>🔒 This vault is encrypted.</p>
          </div>
          <input
            type="password"
            placeholder="Enter master password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-3 py-2 mb-2 border rounded bg-[var(--color-background)] text-[var(--color-foreground)]"
          />
          <button
            onClick={handleDecrypt}
            disabled={decrypting}
            className="bg-[var(--color-brand)] text-white px-4 py-2 rounded hover:bg-[var(--color-brand-hover)] w-full"
          >
            {decrypting ? "Decrypting..." : "Unlock Vault"}
          </button>
          {decryptError && (
            <p className="text-sm text-red-500 mt-2">{decryptError}</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Vault Entries</h3>
            <button
              className="flex items-center gap-2 bg-[var(--color-brand)] text-white px-4 py-2 rounded hover:bg-[var(--color-brand-hover)]"
              onClick={() => setShowModal(true)}
            >
              <FiPlus className="text-base" />
              Add Credential
            </button>
          </div>

          {decryptedContent.length > 0 ? (
            <div className="space-y-2">
              {decryptedContent.map((cred, idx) => (
                <div
                  key={idx}
                  className="border border-[var(--color-border)] rounded p-3 bg-[var(--color-surface)]"
                >
                  <p className="font-semibold">{cred.title}</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {cred.username}
                  </p>
                  <p className="text-sm font-mono">••••••••</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[var(--color-muted)]">
              No credentials yet. Click “Add Credential” to get started.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AddCredentialModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddCredential}
      />
    </div>
  );
};

export default VaultDetailPage;
