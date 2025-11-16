import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import SecretsProvider from "./contexts/SecretsContext";
import useAuth from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import Test from "./Test";
import { routes, storageMap } from "./utils/constants";
import DropBoxAuthRedirectPage from "./pages/DropBoxAuthRedirectPage";
import { useEffect } from "react";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <h1>Secret Manager app</h1>
//       </div>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//       </Routes>
//     </Router>
//   );
// }
function InnerApp() {
  const { isAuthenticated, initializeAuth } = useAuth();
  useEffect(() => {
    initializeAuth();
  }, []);
  return isAuthenticated ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <SecretsProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<InnerApp />} />
            <Route path={routes.test} element={<Test />} />
            <Route path={routes.dropboxAuthCallback} element={<DropBoxAuthRedirectPage />} />
          </Routes>
        </Router>
      </SecretsProvider>
    </AuthProvider>
  );
}

export default App;
