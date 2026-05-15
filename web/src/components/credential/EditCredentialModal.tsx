import { useState, useEffect } from "react";
import type { VaultCredential } from "../../types/Vault";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import PasswordField from "../ui/password-field";
import { Textarea } from "../ui/textarea";

interface EditCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cred: VaultCredential) => void;
  initialData: VaultCredential;
}

const EditCredentialModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditCredentialModalProps) => {
  const [formData, setFormData] = useState<VaultCredential>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="edit-credential-title">Title *</Label>
            <Input id="edit-credential-title" type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-credential-username">Username</Label>
            <Input id="edit-credential-username" type="text" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <PasswordField
            id="edit-credential-password"
            label="Password"
            value={formData.password || ""}
            onChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
          />
          <div className="space-y-1">
            <Label htmlFor="edit-credential-url">URL</Label>
            <Input id="edit-credential-url" type="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://example.com" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-credential-note">Note</Label>
            <Textarea id="edit-credential-note" name="note" value={formData.note} onChange={handleChange} rows={3} className="resize-none" />
          </div>

          <Button type="submit" className="mt-2 w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCredentialModal;
