import { useState } from "react";
import { KeyRound } from "lucide-react";
import type { VaultCredential } from "../../types/Vault";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import PasswordField from "../ui/password-field";
import { Textarea } from "../ui/textarea";

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
    id: "",
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
    if (!formData.title.trim()) return;

    const credentiaWithId = {
      ...formData,
      id: crypto.randomUUID(),
    }
    onSave(credentiaWithId);
    onClose();
    setFormData({ id: "", title: "", username: "", password: "", note: "" });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" /> Add credential
          </DialogTitle>
          <DialogDescription>
            Add a private record to this unlocked archive.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="credential-title">Title *</Label>
            <Input id="credential-title" type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Service name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credential-username">Username</Label>
            <Input id="credential-username" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="name@example.com" />
          </div>
          <PasswordField
            id="credential-password"
            label="Password"
            value={formData.password || ""}
            onChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
          />
          <div className="space-y-2">
            <Label htmlFor="credential-url">URL</Label>
            <Input id="credential-url" type="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credential-note">Note</Label>
            <Textarea id="credential-note" name="note" value={formData.note} onChange={handleChange} rows={3} className="resize-none" />
          </div>

          <Button type="submit" className="mt-2 w-full">
            Save credential
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCredentialModal;
