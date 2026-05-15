import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-destructive">Confirm deletion</DialogTitle>
          <DialogDescription>
            This action will permanently delete <strong>{vaultName}</strong> and all of its credentials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="confirm-vault-name">
            To confirm, type <strong>{vaultName}</strong>
          </Label>
          <Input
            id="confirm-vault-name"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={!isMatch} onClick={onConfirm}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
