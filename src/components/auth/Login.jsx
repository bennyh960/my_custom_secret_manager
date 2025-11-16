import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { storageMap } from "../../utils/constants";
import useLocalStorage from "../../hooks/useLocalStorage";

const MAX_RETRIES = 5;
const RETRY_DELAY_MINUTES = 10;

const Login = () => {
  const [password, setPassword] = useState("");
  const [userPath, setUserPath] = useState("");
  const [retries, setRetries] = useLocalStorage(storageMap.login_retries, { count: 0, time: new Date().getTime() });
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (isValidByMaxRetries() && password && userPath) {
      try {
        return await login(password, userPath);
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
        setRetries((p) => ({ count: p.count + 1, time: new Date().getTime() }));
      }
    }
  };

  const isValidByMaxRetries = () => {
    if (retries.count >= MAX_RETRIES) {
      const storedLockoutTime = retries.time;

      const currentTime = new Date().getTime();
      const maxLockoutTime = storedLockoutTime + RETRY_DELAY_MINUTES * 60 * 1000;

      if (currentTime < maxLockoutTime) {
        const minutesLeft = Math.ceil((maxLockoutTime - currentTime) / (60 * 1000));
        alert(`Too many failed attempts. Please try again in ${minutesLeft} minute(s).`);
        return false;
      }
      setRetries({ count: 0, time: new Date().getTime() });
    }
    return true;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔐 Secret Manager</h1>
          <p className="text-gray-600">Secure your secrets with encryption</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dropbox User</label>
            <input
              type="password"
              value={userPath}
              onChange={(e) => setUserPath(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your Dropbox token"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Master Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your master password"
            />
            <p className="mt-2 text-xs text-gray-500">
              Get your token from{" "}
              <a
                href="https://www.dropbox.com/developers/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Dropbox App Console
              </a>
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Unlock Secrets
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
