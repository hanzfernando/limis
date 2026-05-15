import { useState, useEffect } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import PasswordField from "../ui/password-field";
import { Textarea } from "../ui/textarea";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vaultData: { name: string; desc: string }, password: string) => void;
  isSubmitting?: boolean;
  error?: string | null;
}

const AddVaultModal = ({ isOpen, onClose, onSubmit, isSubmitting, error }: Props) => {
  const [vaultData, setVaultData] = useState({
    name: "",
    desc: "",
  });
  const [masterPassword, setMasterPassword] = useState("");
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVaultData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultData.name || !masterPassword) return;
    onSubmit(vaultData, masterPassword);
  };


  useEffect(() => {
    if (!isOpen) {
      setVaultData({ name: "", desc: "" });
      setMasterPassword("");
    }

    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md animate-fadeIn">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-primary" /> New vault
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vault-name">Vault Name</Label>
            <Input id="vault-name" name="name" value={vaultData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vault-desc">Vault Description</Label>
            <Textarea id="vault-desc" name="desc" value={vaultData.desc} onChange={handleChange} />
          </div>

          <PasswordField
            id="vault-master-password"
            label="Master Password"
            value={masterPassword}
            onChange={setMasterPassword}
            required
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={!vaultData.name || !masterPassword || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Vault"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVaultModal;
