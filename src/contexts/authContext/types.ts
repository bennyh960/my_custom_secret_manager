export interface AuthContextType {
  isAuthenticated: boolean;
  userPath: string;
  isLoading: boolean;
  initializeAuth: () => Promise<void>;
  login: (password: string, path: string) => Promise<void>;
  logout: () => void;
}

export const initialAuthContext: AuthContextType = {
  isAuthenticated: false,
  userPath: "",
  isLoading: true,
  initializeAuth: async () => {},
  login: async () => {},
  logout: () => {},
};
