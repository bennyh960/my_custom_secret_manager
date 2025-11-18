export interface Secret {
  id?: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  tags: string[];
}

interface Settings {
  theme: "light" | "dark";
}

export type Tag = { name: string; color: string };

interface userSecretsData {
  secrets: Secret[];
  tags: Tag[];
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
  addTag: (tag: Tag) => Promise<void>;
  deleteTag: (tagName: string) => Promise<void>;
  updateTag: (oldTagName: string, newTag: Tag) => Promise<void>;
}

export const initialSecretDataContext: SecretsContextType = {
  userSecretData: {
    secrets: [],
    tags: [
      { name: "Private", color: "green" },
      { name: "Work", color: "red" },
    ],
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
  addTag: async () => {},
  deleteTag: async () => {},
  updateTag: async () => {},
};
