import { createContext, useEffect, useState } from "react";
import dropboxService from "../services/dropboxService";
import { storageMap } from "../utils/constants";

// ============ Auth Context ============
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPath, setUserPath] = useState("");

  const initializeAuth = () => {
    const storedUserPath = sessionStorage.getItem(storageMap.sessionStorage_user_path);
    if (storedUserPath) {
      setUserPath(storedUserPath);
      setIsAuthenticated(true);
    }
  };

  const login = async (password, path) => {
    const response = await dropboxService.listFiles(path + "_" + password); // verify path exists
    if (response === null) {
      throw new Error("User does not exist in Dropbox.");
    }
    const entries = response.result.entries;

    let entryPath = entries.find((e) => e.name === "secrets.json")?.path_lower;
    if (!entryPath) {
      entryPath = `/${path}_${password}/secrets.json`;
      await dropboxService.writeSecrets(entryPath, JSON.stringify([])); // create empty secrets file
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
    <AuthContext.Provider value={{ isAuthenticated, userPath, login, logout, initializeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; // default export for component
export { AuthContext }; // optional
