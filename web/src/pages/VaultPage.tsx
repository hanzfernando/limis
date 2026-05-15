import { useEffect, useState } from "react";
import { Archive, EyeOff, Layers3, Plus, ShieldCheck } from "lucide-react";
import SearchInput from "../components/SearchInput";
import VaultList from "../components/vault/VaultList";
import AddVaultModal from "../components/vault/AddVaultModal";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { createVaultThunk, fetchVaultsThunk } from "../state/thunks/vaultThunk";
import { selectVaults, selectVaultLoading, selectVaultError } from "../state/slices/vaultSlice";
import { encryptVaultData } from "../utils/cryptoUtils";
import { showToast } from "../utils/showToast";
import PageContainer from "../components/ui/page-container";
import { Button } from "../components/ui/button";

const VaultPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


  const vaults = useAppSelector(selectVaults);
  const loading = useAppSelector(selectVaultLoading);
  const error = useAppSelector(selectVaultError);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);



  useEffect(() => {
    dispatch(fetchVaultsThunk());
  }, [dispatch]);

  const filteredVaults = vaults!.filter((vault) =>
    vault.name.toLowerCase().includes(search.toLowerCase())
  );
  const vaultCount = vaults?.length ?? 0;

  const handleVaultClick = (vaultId: string) => {
    navigate(`/vaults/${vaultId}`); // <-- navigate to detail page
  };

const handleAddVault = async (
  vaultData: { name: string; desc: string },
  password: string
) => {
  setIsSubmitting(true);
  setSubmitError(null);

  try {
    const { ciphertext, iv, salt } = await encryptVaultData({}, password);

    const res = await dispatch(
      createVaultThunk({
        name: vaultData.name,
        desc: vaultData.desc,
        ciphertext,
        iv,
        salt,
      })
    );

    if (res?.success) {
      showToast("Vault created successfully!");
      setShowModal(false);
      dispatch(fetchVaultsThunk());
    } else {
      const errorMsg = res?.message || "Failed to create vault.";
      showToast(errorMsg, "error");
      setSubmitError(errorMsg);
    }
  } catch (err) {
    console.error("Vault submission error:", err);
    showToast("Unexpected error occurred", "error");
    setSubmitError("Unexpected error occurred");
  } finally {
    setIsSubmitting(false);
  }
};




  return (
    <PageContainer>
      <div className="archive-surface mb-6 overflow-y-auto rounded-lg bg-card/80 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="mr-4 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
                <Archive className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase text-muted-foreground">Encrypted archive</p>
                <h1 className="text-3xl font-semibold">Your vaults</h1>
              </div>
              
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Auri keeps each vault sealed until you choose to unlock it.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>New vault</span>
          </Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-background/55 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers3 className="h-4 w-4 text-primary" />
              Vaults
            </div>
            <p className="mt-2 text-2xl font-semibold">{vaultCount}</p>
          </div>
          <div className="rounded-md border border-border bg-background/55 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              State
            </div>
            <p className="mt-2 text-sm font-medium">Locally sealed view</p>
          </div>
          <div className="rounded-md border border-border bg-background/55 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <EyeOff className="h-4 w-4 text-primary" />
              Posture
            </div>
            <p className="mt-2 text-sm font-medium">Private by default</p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card/70 p-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search vaults..." />
      </div>

      {loading && <p className="text-muted-foreground">Loading vaults...</p>}
      {error && <p className="text-destructive">{error}</p>}

      {!loading && <VaultList vaults={filteredVaults} onVaultClick={handleVaultClick} />}

      <AddVaultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddVault}
        isSubmitting={isSubmitting}
        error={submitError}
      />

    </PageContainer>
  );
};

export default VaultPage;
