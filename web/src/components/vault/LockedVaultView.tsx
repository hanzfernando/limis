import { Archive, EyeOff, Fingerprint, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import type { FormEvent } from "react";
import type { Vault } from "../../types/Vault";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import BrandMark from "../BrandMark";

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
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-0 py-6">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1fr] lg:items-stretch">
        <section className="archive-surface hidden overflow-hidden rounded-lg bg-card/80 p-6 lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandMark />
            <div className="mt-12">
              <p className="text-sm font-medium uppercase text-muted-foreground">Sealed by Auri</p>
              <h1 className="mt-3 max-w-sm text-3xl font-semibold leading-tight">
                This archive stays silent until the right key arrives.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                Limis keeps credential contents hidden locally, then opens a temporary workspace only after decryption.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-md border border-border bg-background/55 px-3 py-2">
              <EyeOff className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Credential contents are concealed</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border bg-background/55 px-3 py-2">
              <Fingerprint className="h-4 w-4 text-primary" />
              <span className="truncate font-mono text-xs text-muted-foreground">{vault.id}</span>
            </div>
          </div>
        </section>

      <Card className="archive-surface relative w-full overflow-hidden bg-card/90 backdrop-blur">
        <div className="archive-line absolute left-8 right-8 top-0 h-px" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
              <Archive className="h-5 w-5" />
            </span>
            <span className="min-w-0 truncate">{vault.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={onDecrypt} className="space-y-5">

        <div className="mb-2 space-y-2 rounded-md border border-border bg-background/55 p-4 text-sm text-muted-foreground">
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
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="unlock-password"
                type="password"
                placeholder="Enter master password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

        <Button type="submit" disabled={decrypting} className="w-full">
          <ShieldCheck className="h-4 w-4" />
          {decrypting ? "Decrypting..." : "Unlock vault"}
        </Button>

        {decryptError && (
          <p className="mt-3 rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {decryptError}
          </p>
        )}
        </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}



export default LockedVaultView;
