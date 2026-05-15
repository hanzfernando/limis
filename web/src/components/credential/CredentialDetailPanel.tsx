import {
  Copy,
  Eye,
  EyeOff,
  FileText,
  Fingerprint,
  Globe2,
  KeyRound,
  LockKeyhole,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
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

type DetailFieldProps = {
  label: string;
  value?: string;
  icon: ReactNode;
  monospace?: boolean;
  children?: ReactNode;
  onCopy?: () => void;
};

function DetailField({ label, value, icon, monospace, children, onCopy }: DetailFieldProps) {
  if (!value && !children) return null;

  return (
    <section className="rounded-lg border border-border bg-background/55 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
          <span className="text-primary">{icon}</span>
          {label}
        </div>
        {onCopy && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCopy}
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            aria-label={`Copy ${label.toLowerCase()}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      {children ?? (
        <p className={monospace ? "break-all font-mono text-sm" : "break-words text-sm"}>
          {value}
        </p>
      )}
    </section>
  );
}

const CredentialDetailPanel = ({ credential, onClose, onEdit, onDelete }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyValue = (value: string | undefined, label: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    showToast(`${label} copied to clipboard`, "info");
  };

  return (
    <aside className="relative h-full overflow-y-auto bg-card">
      <div className="archive-line absolute left-6 right-6 top-0 h-px" />

      <header className="border-b border-border p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <KeyRound className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase text-muted-foreground">Credential record</p>
              <h2 className="mt-1 truncate text-xl font-semibold">{credential.title}</h2>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={onEdit} className="justify-start">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDelete}
            className="justify-start border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </header>

      <div className="space-y-4 p-5">
        <div className="rounded-lg border border-border bg-secondary/45 p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            This record is visible only inside the current unlocked session.
          </div>
        </div>

        <DetailField
          label="Username"
          value={credential.username || "No username saved"}
          icon={<UserRound className="h-4 w-4" />}
          onCopy={credential.username ? () => copyValue(credential.username, "Username") : undefined}
        />

        <DetailField
          label="Password"
          value={credential.password ? (showPassword ? credential.password : "********") : "No password saved"}
          icon={<LockKeyhole className="h-4 w-4" />}
          monospace
          onCopy={credential.password ? () => copyValue(credential.password, "Password") : undefined}
        >
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 break-all font-mono text-sm">
              {credential.password ? (showPassword ? credential.password : "********") : "No password saved"}
            </p>
            {credential.password && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prev) => !prev)}
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </DetailField>

        {credential.url && (
          <DetailField
            label="URL"
            value={credential.url}
            icon={<Globe2 className="h-4 w-4" />}
            onCopy={() => copyValue(credential.url, "URL")}
          >
            <a
              href={credential.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-primary hover:underline"
            >
              {credential.url}
            </a>
          </DetailField>
        )}

        {credential.note && (
          <DetailField label="Note" value={credential.note} icon={<FileText className="h-4 w-4" />}>
            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/90">{credential.note}</p>
          </DetailField>
        )}

        <DetailField
          label="Record fingerprint"
          value={credential.id}
          icon={<Fingerprint className="h-4 w-4" />}
          monospace
          onCopy={() => copyValue(credential.id, "Record ID")}
        />
      </div>
    </aside>
  );
};

export default CredentialDetailPanel;
