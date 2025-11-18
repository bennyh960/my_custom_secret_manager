import { createContext, ReactNode, useCallback, useState } from "react";
import dropboxService from "../../services/dropboxService";
import { NODE_ENV, storageMap } from "../../utils/constants";
import dropboxAuthService from "../../services/dropboxAuthService";
import { initialAuthContext } from "./types";
import { initialSecretDataContext } from "../secretContext/types";

// ============ Auth Context ============
const AuthContext = createContext(initialAuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPath, setUserPath] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const accessToken = localStorage.getItem(storageMap.db_access_token);
    const storedUserPath = sessionStorage.getItem(storageMap.sessionStorage_user_path);

    // SCENARIO 1: Returning from Dropbox OAuth (has code in URL)
    if (code) {
      await dropboxAuthService.getAccessToken();

      // Clean URL after successful token exchange
      window.history.replaceState({}, "", window.location.pathname);

      setIsLoading(false);
      return;
    }

    // SCENARIO 2: User already authenticated (has valid token)
    if (accessToken && storedUserPath) {
      console.warn("User already authenticated");
      setUserPath(storedUserPath);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // SCENARIO 3: No token, no code → First visit, need to authenticate
    // console.log("No authentication found, redirecting to Dropbox...");
    setIsLoading(false);
    await dropboxAuthService.authenticate();
  }, []);

  const login = async (password: string, path: string) => {
    // const response1 = await dropboxService.listFiles(""); // verify path exists
    // console.log("Dropbox root response:", response1);
    const response = await dropboxService.listFiles(path + "_" + password); // verify path exists
    if (response === null) {
      throw new Error("User does not exist in Dropbox.");
    }
    const entries = response.result.entries;

    let entryPath = entries.find((e) => e.name === "secrets.json")?.path_lower;

    if (NODE_ENV === "development" && !entryPath) {
      entryPath = `/${path}_${password}/secrets.json`;
      await dropboxService.writeSecrets(entryPath, JSON.stringify(initialSecretDataContext.userSecretData)); // create empty secrets file
    } else if (!entryPath) {
      throw new Error(`secrets not found for user:${path} please contact admin.`);
    }
    setUserPath(entryPath);
    localStorage.removeItem(storageMap.login_retries); // reset on success
    setIsAuthenticated(true);
    sessionStorage.setItem(storageMap.sessionStorage_user_path, entryPath);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserPath("");
    sessionStorage.removeItem(storageMap.sessionStorage_user_path);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userPath, login, logout, initializeAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; // default export for component
export { AuthContext }; // optional
