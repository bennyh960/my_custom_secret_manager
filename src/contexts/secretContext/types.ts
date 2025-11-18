export interface Secret {
  id: string;
  title: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  tags?: string[];
}

interface Settings {
  theme: "light" | "dark";
}

interface userSecretsData {
  secrets: Secret[];
  tags: string[];
  settings: Settings;
}

export interface SecretsContextType {
  userSecretData: userSecretsData;
  loading: boolean;
  error: string | null;
  loadUserData: () => Promise<void>;
  addSecret: (secret: Omit<Secret, "id">) => Promise<void>;
  updateSecret: (id: string, updatedSecret: Omit<Secret, "id">) => Promise<void>;
  deleteSecret: (id: string) => Promise<void>;
}

export const initialSecretDataContext: SecretsContextType = {
  userSecretData: {
    secrets: [],
    tags: [],
    settings: {
      theme: "light",
    },
  },
  loading: false,
  error: null,
  loadUserData: async () => {},
  addSecret: async () => {},
  updateSecret: async () => {},
  deleteSecret: async () => {},
};
