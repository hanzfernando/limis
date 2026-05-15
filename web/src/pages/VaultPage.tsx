import { useEffect, useState } from "react";
import { Archive, Plus, ShieldCheck } from "lucide-react";
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
            <Archive className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium uppercase text-muted-foreground">Encrypted archive</p>
          <h1 className="mt-2 text-3xl font-semibold">Your vaults</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
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

      <div className="mb-6 rounded-lg border border-border bg-card/70 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Search stays local to your current archive view.</span>
        </div>
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
