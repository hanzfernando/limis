import { useState } from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import type { VaultCredential } from "../../types/Vault";

type Props = {
  credential: VaultCredential;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const CredentialDetailPanel = ({ credential, onClose, onEdit, onDelete }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative h-full flex-shrink-0 bg-[var(--color-surface)] shadow-lg border-l border-[var(--color-border)] overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
        <div>
          <h2 className="text-lg font-semibold">{credential.title}</h2>
          <p className="text-sm text-[var(--color-muted)]">{credential.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-sm text-[var(--color-brand)] hover:underline"
          >
              Edit
          </button>
          <button
            onClick={onDelete}
            className="text-sm text-[var(--color-danger)] hover:underline"
          >
              Delete
          </button>
          <button
            onClick={onClose}
            className="text-xl cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            <IoClose />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm text-[var(--color-muted)] mb-1">Username</label>
          <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded px-3 py-2 font-mono text-sm">
            {credential.username}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-[var(--color-muted)] mb-1">Password</label>
          <div className="relative">
            <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded px-3 py-2 font-mono text-sm pr-10">
              {showPassword ? credential.password : "••••••••"}
            </div>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
        </div>

        {/* URL */}
        {credential.url && (
          <div>
            <label className="block text-sm text-[var(--color-muted)] mb-1">URL</label>
            <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded px-3 py-2 text-sm break-all">
              <a
                href={credential.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-brand)] hover:underline"
              >
                {credential.url}
              </a>
            </div>
          </div>
        )}

        {/* Note */}
        {credential.note && (
          <div>
            <label className="block text-sm text-[var(--color-muted)] mb-1">Note</label>
            <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded px-3 py-2 text-sm whitespace-pre-wrap">
              {credential.note}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CredentialDetailPanel;
