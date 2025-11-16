// /dropbox/callback
import React, { useEffect } from "react";
import dropboxAuthService from "../services/dropboxAuthService";

const DropBoxAuthRedirectPage = () => {
  useEffect(() => {
    dropboxAuthService.getAccessToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.12 2L2 5.25 6.12 8.5l4.12-3.25L6.12 2zm11.76 0l-4.12 3.25L17.88 8.5 22 5.25 17.88 2zM2 12.75l4.12 3.25 4.12-3.25L6.12 9.5 2 12.75zm15.88-3.25l-4.12 3.25 4.12 3.25L22 12.75 17.88 9.5zM6.12 16.25L2 19.5 6.12 22.75l4.12-3.25-4.12-3.25zm11.76 0l-4.12 3.25 4.12 3.25L22 19.5l-4.12-3.25z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-white mb-3">Authentication Complete</h1>

        <p className="text-slate-300 mb-8">
          Your Dropbox account has been securely connected.
          <br />
          You can now return to the app.
        </p>

        {/* Button */}
        <a
          href="/login"
          className="inline-block px-6 py-3 text-lg font-medium rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default DropBoxAuthRedirectPage;
