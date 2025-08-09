import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";

type Props = {
  vaultName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteVaultModal({ vaultName, isOpen, onClose, onConfirm }: Props) {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const isMatch = input === vaultName;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-surface)] text-[var(--color-foreground)] p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4 text-[var(--color-danger)]">Confirm Deletion</h2>
        <p className="text-sm mb-4 text-[var(--color-muted)]">
          This action will permanently delete <strong>{vaultName}</strong> and all of its credentials. This cannot be undone.
        </p>
        <p className="text-sm mb-2">To confirm, type <strong>{vaultName}</strong> below:</p>

        <input
          type="text"
          className="w-full px-3 py-2 mb-4 border border-[var(--color-border)] rounded bg-transparent text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
          >
            Cancel
          </button>
          <button
            disabled={!isMatch}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded text-white flex items-center gap-2
              ${isMatch ? "bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)]" : "bg-[var(--color-danger)] opacity-50 cursor-not-allowed"}
            `}
          >
            <FiTrash2 />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
