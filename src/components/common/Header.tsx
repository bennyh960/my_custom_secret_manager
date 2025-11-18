import { AuthContextType } from "../../contexts/authContext/types";

const Header = ({ onLogout }: { onLogout: AuthContextType["logout"] }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">🔐 Secret Manager</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
