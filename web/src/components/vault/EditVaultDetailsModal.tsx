import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import type { Vault } from "../../types/Vault";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type Props = {
  isOpen: boolean;
  vault: Vault;
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: { name: string; desc?: string }) => void;
};

export default function EditVaultDetailsModal({
  isOpen,
  vault,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState(vault.name);
  const [desc, setDesc] = useState(vault.desc ?? "");

  useEffect(() => {
    if (isOpen) {
      setName(vault.name);
      setDesc(vault.desc ?? "");
    }
  }, [isOpen, vault.desc, vault.name]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), desc: desc.trim() });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4 text-primary" />
            Edit archive details
          </DialogTitle>
          <DialogDescription>
            Rename this vault or refine its description. Encrypted contents are not changed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-vault-name">Vault name</Label>
            <Input
              id="edit-vault-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Personal archive"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-vault-desc">Description</Label>
            <Textarea
              id="edit-vault-desc"
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              placeholder="What this vault protects"
              className="resize-none"
            />
          </div>

          {error && (
            <p className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save details"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
