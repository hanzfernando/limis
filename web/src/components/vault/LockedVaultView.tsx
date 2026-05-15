import { Archive, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
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
      <Card className="archive-surface relative w-full max-w-md overflow-hidden bg-card/90 backdrop-blur">
        <div className="archive-line absolute left-8 right-8 top-0 h-px" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
              <Archive className="h-5 w-5" />
            </span>
            <span className="min-w-0 truncate">{vault.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={onDecrypt} className="space-y-4">

        <div className="mb-2 space-y-2 rounded-md border border-border bg-background/55 p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-primary" />
            <p>This vault is encrypted and waiting for your master password.</p>
          </div>
          <div className="flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-primary" />
            <p>Credential contents remain hidden until unlock.</p>
          </div>
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
          <ShieldCheck className="h-4 w-4" />
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
