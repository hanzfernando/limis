import { Archive, LockKeyhole } from "lucide-react";
import type { FormEvent } from "react";
import type { Vault } from "../../types/Vault";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  vault: Vault;
  password: string;
  setPassword: (pw: string) => void;
  decrypting: boolean;
  decryptError: string;
  onDecrypt: (event: FormEvent<HTMLFormElement>) => void;
};

const LockedVaultView = ({
  vault,
  password,
  setPassword,
  decrypting,
  decryptError,
  onDecrypt,
}: Props) => {
  return(
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card/90 shadow-[0_24px_90px_rgba(20,14,32,0.14)] backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
              <Archive className="h-5 w-5" />
            </span>
            {vault.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={onDecrypt} className="space-y-4">

        <div className="mb-2 flex items-center gap-2 rounded-md border border-border bg-secondary/55 px-3 py-2 text-sm text-muted-foreground">
          <LockKeyhole className="h-4 w-4 text-primary" />
          <p>This vault is encrypted and waiting for your master password.</p>
        </div>

          <div className="space-y-2">
            <Label htmlFor="unlock-password">Master password</Label>
            <Input
              id="unlock-password"
              type="password"
              placeholder="Enter master password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

        <Button type="submit" disabled={decrypting} className="w-full">
          {decrypting ? "Decrypting..." : "Unlock vault"}
        </Button>

        {decryptError && <p className="mt-3 text-sm text-destructive">{decryptError}</p>}
        </form>
        </CardContent>
      </Card>
    </div>
  );
}



export default LockedVaultView;
