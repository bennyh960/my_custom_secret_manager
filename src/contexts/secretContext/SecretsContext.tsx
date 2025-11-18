import { createContext, ReactNode, useState } from "react";
import dropboxService from "../../services/dropboxService";
import encryptionService from "../../services/encryptionService";
import useAuth from "../../hooks/useAuth";
import { initialSecretDataContext, Secret, SecretsContextType } from "./types";

// ============ Secrets Context ============
const SecretsContext = createContext(initialSecretDataContext);

const SecretsProvider = ({ children }: { children: ReactNode }) => {
  const [userSecretData, setUserSecretData] = useState(initialSecretDataContext.userSecretData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userPath } = useAuth();

  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const encryptedData = await dropboxService.readSecrets(userPath);
      if (encryptedData && encryptedData.length > 1) {
        const decrypted = await encryptionService.decrypt(encryptedData, userPath);
        console.log("Decrypted Data:", decrypted);
        setUserSecretData(decrypted);
      } else {
        setUserSecretData(initialSecretDataContext.userSecretData);
      }
    } catch (err: any) {
      setError("Failed to load secrets: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData: SecretsContextType["userSecretData"]) => {
    setLoading(true);
    setError(null);
    try {
      const encrypted = await encryptionService.encrypt(newData, userPath);
      await dropboxService.writeSecrets(userPath, encrypted);
      setUserSecretData(newData);
    } catch (err: any) {
      setError("Failed to save secrets: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations on Secrets
  const addSecret = async (secret: Omit<Secret, "id">) => {
    const newSecret = { ...secret, id: Date.now().toString() };
    await saveData({ ...userSecretData, secrets: [...userSecretData.secrets, newSecret] });
  };

  const updateSecret = async (id: string, updatedSecret: Omit<Secret, "id">) => {
    const newSecrets = userSecretData.secrets.map((s) => (s.id === id ? { ...updatedSecret, id } : s));
    await saveData({ ...userSecretData, secrets: newSecrets });
  };

  const deleteSecret = async (id: string) => {
    const newSecrets = userSecretData.secrets.filter((s) => s.id !== id);
    await saveData({ ...userSecretData, secrets: newSecrets });
  };

  // CRUD Operations on Tags could be added similarly
  const addTag = async (tag: { name: string; color: string }) => {
    const tagMap = new Map(
      userSecretData.tags.map((t) => [t.name, t]) // existing tags
    );

    tagMap.set(tag.name, tag);
    const newTags = Array.from(tagMap.values());

    await saveData({ ...userSecretData, tags: newTags });
  };

  const deleteTag = async (tagName: string) => {
    const newTags = userSecretData.tags.filter((t) => t.name !== tagName);
    const newSecrets = userSecretData.secrets.map((s) => ({
      ...s,
      tags: s.tags.filter((t) => t !== tagName),
    }));
    await saveData({ ...userSecretData, secrets: newSecrets, tags: newTags });
  };

  const updateTag = async (oldTagName: string, newTag: { name: string; color: string }) => {
    const newTags = userSecretData.tags.map((t) => (t.name === oldTagName ? newTag : t));
    const newSecrets = userSecretData.secrets.map((s) => ({
      ...s,
      tags: s.tags.map((t) => (t === oldTagName ? newTag.name : t)),
    }));
    await saveData({ ...userSecretData, secrets: newSecrets, tags: newTags });
  };

  return (
    <SecretsContext.Provider
      value={{
        userSecretData,
        loading,
        error,
        loadUserData,
        addSecret,
        updateSecret,
        deleteSecret,
        addTag,
        deleteTag,
        updateTag,
      }}
    >
      {children}
    </SecretsContext.Provider>
  );
};

export default SecretsProvider; // default export for component
export { SecretsContext };
