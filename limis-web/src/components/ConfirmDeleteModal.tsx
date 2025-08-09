import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-surface)] p-6 rounded-lg w-full max-w-md shadow-lg relative border border-[var(--color-border)]">
        <h2 className="text-lg font-semibold mb-2 text-[var(--color-foreground)]">
          Delete <span className="text-[var(--color-danger)]">{title}</span>?
        </h2>
        <p className="text-sm text-[var(--color-muted)] mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] text-white hover:bg-[var(--color-foreground)]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-[var(--color-danger)] text-white hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
