import { FaPlus } from "react-icons/fa6";

const VaultPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Vault</h1>

      <div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[] text-white rounded-md hover:bg-blue-700 transition">
          <FaPlus />
          <span>Add Vault</span>
        </button>
      </div>
    </div>
  );
};

export default VaultPage;
