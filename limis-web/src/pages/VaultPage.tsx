import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Vault</h1>
        <Button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FaPlus />
          <span>Add Vault</span>
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} />

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
