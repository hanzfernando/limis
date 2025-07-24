import { useState, useEffect } from "react";
import { FaLock, FaTimes } from "react-icons/fa";
import { encryptVaultData } from "../../utils/cryptoUtils";
import { addVault } from "../../service/vaultService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddVaultModal = ({ isOpen, onClose }: Props) => {
  const [vaultData, setVaultData] = useState({
    name: "",
    desc: "",
  });
  const [masterPassword, setMasterPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVaultData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!masterPassword || !vaultData.name) return;

    setLoading(true);
    try {
      // vaultData contains desc (plaintext), do not encrypt it
      const { ciphertext, iv, salt } = await encryptVaultData(
        {}, // no items yet — encrypting empty vault
        masterPassword
      );

      await addVault({
        name: vaultData.name,
        desc: vaultData.desc,
        ciphertext,
        iv,
        salt,
      });

      onClose();
    } catch (err) {
      console.error("Vault submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaLock /> New Vault
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Vault Name"
            className="w-full px-4 py-2 rounded-md bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
            value={vaultData.name}
            onChange={handleChange}
          />

          <textarea
            name="desc"
            placeholder="Vault Description (Optional)"
            className="w-full px-4 py-2 rounded-md bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
            value={vaultData.desc}
            onChange={handleChange}
          />

          <input
            name="masterPassword"
            type="password"
            placeholder="Master Password"
            className="w-full px-4 py-2 rounded-md bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
            value={masterPassword}
            onChange={e => setMasterPassword(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-4 py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Vault"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVaultModal;
