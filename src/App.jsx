import AuthProvider from "./contexts/AuthContext";
import SecretsProvider from "./contexts/SecretsContext";
import useAuth from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import { useEffect } from "react";

function InnerApp() {
  const { isAuthenticated, initializeAuth, isLoading } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, []);

  return isAuthenticated ? <Dashboard isAuthLoading={isLoading} /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <SecretsProvider>
        <InnerApp />
      </SecretsProvider>
    </AuthProvider>
  );
}

export default App;
