type ConfirmLogoutModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmLogoutModal({ onClose, onConfirm }: ConfirmLogoutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-surface)] text-[var(--color-foreground)] p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p className="text-sm text-[var(--color-muted)] mb-6">Are you sure you want to log out?</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
