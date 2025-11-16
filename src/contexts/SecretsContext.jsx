import { createContext, useState } from "react";
import dropboxService from "../services/dropboxService";
import encryptionService from "../services/encryptionService";
import useAuth from "../hooks/useAuth";

// ============ Secrets Context ============
const SecretsContext = createContext();

const SecretsProvider = ({ children }) => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userPath } = useAuth();

  const loadSecrets = async () => {
    setLoading(true);
    setError(null);
    try {
      const encryptedData = await dropboxService.readSecrets(userPath);
      if (encryptedData) {
        const decrypted = await encryptionService.decrypt(encryptedData, userPath);
        setSecrets(decrypted);
      } else {
        setSecrets([]);
      }
    } catch (err) {
      setError("Failed to load secrets: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSecrets = async (newSecrets) => {
    setLoading(true);
    setError(null);
    try {
      const encrypted = await encryptionService.encrypt(newSecrets, userPath);
      await dropboxService.writeSecrets(userPath, encrypted);
      setSecrets(newSecrets);
    } catch (err) {
      setError("Failed to save secrets: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSecret = async (secret) => {
    const newSecret = { ...secret, id: Date.now().toString() };
    await saveSecrets([...secrets, newSecret]);
  };

  const updateSecret = async (id, updatedSecret) => {
    const newSecrets = secrets.map((s) => (s.id === id ? { ...updatedSecret, id } : s));
    await saveSecrets(newSecrets);
  };

  const deleteSecret = async (id) => {
    const newSecrets = secrets.filter((s) => s.id !== id);
    await saveSecrets(newSecrets);
  };

  return (
    <SecretsContext.Provider value={{ secrets, loading, error, loadSecrets, addSecret, updateSecret, deleteSecret }}>
      {children}
    </SecretsContext.Provider>
  );
};

export default SecretsProvider; // default export for component
export { SecretsContext };
