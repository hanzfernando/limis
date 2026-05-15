import { Copy, Eye, EyeOff, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { VaultCredential } from "../../types/Vault";
import { showToast } from "../../utils/showToast";
import { Button } from "../ui/button";

type Props = {
  credential: VaultCredential;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const CredentialDetailPanel = ({ credential, onClose, onEdit, onDelete }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyValue = (value: string | undefined, label: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    showToast(`${label} copied to clipboard`, "info");
  };

  return (
    <div className="relative h-full flex-shrink-0 overflow-y-auto border-l border-border bg-card shadow-lg">
      <div className="flex items-start justify-between gap-4 border-b border-border p-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">{credential.title}</h2>
          <p className="truncate text-sm text-muted-foreground">{credential.id}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={onEdit} aria-label="Edit credential">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onDelete} aria-label="Delete credential">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Username</label>
          <div className="relative">
            <div className="rounded-md border border-border bg-background/80 px-3 py-2 pr-10 font-mono text-sm">
              {credential.username}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => copyValue(credential.username, "Username")}
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              aria-label="Copy username"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Password</label>
          <div className="relative">
            <div className="rounded-md border border-border bg-background/80 px-3 py-2 pr-20 font-mono text-sm">
              {showPassword ? credential.password : "********"}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-9 top-1/2 h-8 w-8 -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => copyValue(credential.password, "Password")}
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              aria-label="Copy password"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {credential.url && (
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">URL</label>
            <div className="break-all rounded-md border border-border bg-background/80 px-3 py-2 text-sm">
              <a
                href={credential.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {credential.url}
              </a>
            </div>
          </div>
        )}

        {credential.note && (
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Note</label>
            <div className="whitespace-pre-wrap rounded-md border border-border bg-background/80 px-3 py-2 text-sm">
              {credential.note}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CredentialDetailPanel;
