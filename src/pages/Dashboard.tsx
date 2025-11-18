import { useEffect, useState } from "react";

import Header from "../components/common/Header";
import useAuth from "../hooks/useAuth";
import useSecrets, { Secret } from "../hooks/useSecrets";
import TagsBar from "../components/secrets/TagsBar";
import SecretForm from "../components/secrets/SecretForm";
import SecretCard from "../components/secrets/SecretCard";
import SecretDetail from "../components/secrets/SecretDetail";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Dashboard = ({ isAuthLoading }: { isAuthLoading: boolean }) => {
  const { userSecretData, loadUserData, loading, error, addSecret, updateSecret, deleteSecret } = useSecrets();
  const { logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);
  const [viewingSecret, setViewingSecret] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSave = async (secret: Secret) => {
    if (editingSecret) {
      await updateSecret(editingSecret.id, secret);
    } else {
      await addSecret(secret);
    }
    setShowForm(false);
    setEditingSecret(null);
  };

  const handleEdit = (secret: Secret) => {
    setEditingSecret(secret);
    setShowForm(true);
  };

  const handleDelete = async (id: Secret["id"]) => {
    if (confirm("Are you sure you want to delete this secret?")) {
      await deleteSecret(id);
    }
  };

  const filteredSecrets = userSecretData.secrets.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header onLogout={logout} />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 sm:py-8 w-full relative">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Search & Add */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Search secrets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
          <button
            onClick={() => {
              setEditingSecret(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            + Add Secret
          </button>
        </div>

        {/* Loading */}
        <LoadingSpinner
          isLoading={loading || isAuthLoading}
          text={loading ? "Loading your secrets..." : "Verifying authentication..."}
        />

        {/* Tags */}
        <TagsBar selectedTag={selectedTag} setSelectedTag={setSelectedTag} />

        {/* Secret Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 w-full overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              {editingSecret ? "Edit Secret" : "New Secret"}
            </h2>
            <SecretForm
              secret={editingSecret}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingSecret(null);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSecrets.map((secret) => (
            <SecretCard
              key={secret.id}
              secret={secret}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={setViewingSecret}
            />
          ))}
        </div>

        {/* Empty State */}
        {!loading && !isAuthLoading && filteredSecrets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-sm sm:text-base">
              {searchTerm ? "No secrets found matching your search" : "No secrets yet. Add your first one!"}
            </p>
          </div>
        )}
      </main>

      {viewingSecret && <SecretDetail secret={viewingSecret} onClose={() => setViewingSecret(null)} />}
    </div>
  );
};

export default Dashboard;
