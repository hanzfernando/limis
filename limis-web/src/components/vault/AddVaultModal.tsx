import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaLock, FaTimes } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vaultData: { name: string; desc: string }, password: string) => void;
  isSubmitting?: boolean;
  error?: string | null;
}

const AddVaultModal = ({ isOpen, onClose, onSubmit, isSubmitting, error }: Props) => {
  const [vaultData, setVaultData] = useState({
    name: "",
    desc: "",
  });
  const [masterPassword, setMasterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVaultData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!vaultData.name || !masterPassword) return;
    onSubmit(vaultData, masterPassword);
  };


  useEffect(() => {
    if (!isOpen) {
      setVaultData({ name: "", desc: "" });
      setMasterPassword("");
      setShowPassword(false);
    }

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

          <div className="relative">
            <input
              name="masterPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Master Password"
              className="w-full px-4 py-2 pr-10 rounded-md bg-[var(--color-surface)] text-[var(--color-foreground)] placeholder-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
              value={masterPassword}
              onChange={e => setMasterPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

        </div>

        {error && (
          <p className="mt-4 text-sm text-[var(--color-danger)]">{error}</p>
        )}


        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!vaultData.name || !masterPassword || isSubmitting}
            className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-4 py-2 rounded-md transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Vault"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVaultModal;
