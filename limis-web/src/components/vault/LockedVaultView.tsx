import { FiDatabase, FiLock } from "react-icons/fi";
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
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
          <FiDatabase className="text-xl text-[var(--color-brand)]" />
          {vault.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={onDecrypt} className="space-y-3">

        <div className="flex items-center gap-2 mb-2">
          <FiLock className="text-lg" />
          <p>This vault is encrypted.</p>
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
          {decrypting ? "Decrypting..." : "Unlock Vault"}
        </Button>

        {decryptError && <p className="mt-3 text-sm text-destructive">{decryptError}</p>}
        </form>
        </CardContent>
      </Card>
    </div>
  );
}



export default LockedVaultView;
