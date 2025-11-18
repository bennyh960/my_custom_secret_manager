import { useEffect } from "react";
import useAuth from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import AuthProvider from "./contexts/authContext/AuthContext";
import SecretsProvider from "./contexts/secretContext/SecretsContext";

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
