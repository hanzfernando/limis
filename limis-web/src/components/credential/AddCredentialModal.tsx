import { useState } from "react";
import type { VaultCredential } from "../../types/Vault";
import { FiX } from "react-icons/fi";

interface AddCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cred: VaultCredential) => void;
}

const AddCredentialModal = ({
  isOpen,
  onClose,
  onSave,
}: AddCredentialModalProps) => {
  const [formData, setFormData] = useState<VaultCredential>({
    title: "",
    username: "",
    password: "",
    url: "",
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return; // required
    onSave(formData);
    onClose();
    setFormData({ title: "", username: "", password: "", note: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-surface)] p-6 rounded-lg w-full max-w-md shadow-lg relative border border-[var(--color-border)]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        >
          <FiX className="text-xl" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Credential</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-[var(--color-background)] text-[var(--color-foreground)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-[var(--color-background)] text-[var(--color-foreground)]"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-[var(--color-background)] text-[var(--color-foreground)]"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-[var(--color-background)] text-[var(--color-foreground)]"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded bg-[var(--color-background)] text-[var(--color-foreground)] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white py-2 rounded mt-2"
          >
            Save Credential
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCredentialModal;
