import { FiDatabase, FiLock } from "react-icons/fi";
import type { Vault } from "../../types/Vault";

type Props = {
  vault: Vault;
  password: string;
  setPassword: (pw: string) => void;
  decrypting: boolean;
  decryptError: string;
  onDecrypt: () => void;
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
      <section className="bg-[var(--color-surface)] p-6 rounded border border-[var(--color-border)] w-full max-w-md shadow-lg">
        <header className="flex items-center gap-3 mb-4">
          <FiDatabase className="text-xl text-[var(--color-brand)]" />
          <h1 className="text-3xl font-bold">{vault.name}</h1>
        </header>

        <div className="flex items-center gap-2 mb-2">
          <FiLock className="text-lg" />
          <p>This vault is encrypted.</p>
        </div>

        <input
          type="password"
          placeholder="Enter master password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-3 border rounded bg-[var(--color-background)] text-[var(--color-foreground)]"
        />

        <button
          onClick={onDecrypt}
          disabled={decrypting}
          className="w-full bg-[var(--color-brand)] text-white px-4 py-2 rounded hover:bg-[var(--color-brand-hover)]"
        >
          {decrypting ? "Decrypting..." : "Unlock Vault"}
        </button>

        {decryptError && <p className="text-sm text-red-500 mt-3">{decryptError}</p>}
      </section>
    </div>
  );
}



export default LockedVaultView;
