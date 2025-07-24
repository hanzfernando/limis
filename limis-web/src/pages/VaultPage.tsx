import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import SearchInput from "../components/SearchInput";
import VaultList from "../components/vault/VaultList";
import AddVaultModal from "../components/vault/AddVaultModal";
import type { Vault } from "../types/Vault";
import { getVaults } from "../service/vaultService";
import { useNavigate } from "react-router-dom";

// const mockVaults = [
//   { id: "1", name: "Personal", description: "Private keys and notes" },
//   { id: "2", name: "Work", description: "Project credentials and docs" },
//   { id: "3", name: "Backup", description: "Cloud storage login" },
// ];

const VaultPage = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  // const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchVaults = async () => {
    try {
      const res = await getVaults();
      if (res.success) {
        setVaults(res.data || []);
      } else {
        console.error("Failed to fetch vaults:", res.message);
      }
    } catch (err) {
      console.error("Vault fetch error:", err);
    }
  };

  useEffect(() => {
    fetchVaults();
  }, []);

  const filteredVaults = vaults.filter((vault) =>
    vault.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleVaultClick = (vaultId: string) => {
    navigate(`/vaults/${vaultId}`); // <-- navigate to detail page
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Vault</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 
          bg-[var(--color-brand)] text-white rounded-md 
          hover:bg-[var(--color-brand-hover)] 
          transition focus:outline-none"
        >
          <FaPlus />
          <span>Add Vault</span>
        </button>
      </div>

      <SearchInput value={search} onChange={setSearch} />
      <VaultList vaults={filteredVaults} onVaultClick={handleVaultClick} />

      <AddVaultModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default VaultPage;
