import { useState } from "react";
import EyeIcon from "../../assets/eyeIcon.svg";
import copyIcon from "../../assets/copyIcon.svg";
import copyCheckIcon from "../../assets/copyCheckIcon.svg";
import EyeCloseIcon from "../../assets/eyeCloseIcon.svg";
import { Secret } from "../../contexts/secretContext/types";

interface ISecretDetailProps {
  secret: Secret;
  onClose: () => void;
}

const SecretDetail = ({ secret, onClose }: ISecretDetailProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = async () => {
    await navigator.clipboard.writeText(secret.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{secret.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="space-y-3">
          {secret.username && (
            <div>
              <label className="text-sm font-medium text-gray-600">Username</label>
              <p className="text-gray-800">{secret.username}</p>
            </div>
          )}

          {secret.password && (
            <div>
              <label className="text-sm font-medium text-gray-600">Password</label>
              <div className="flex items-center justify-between gap-2">
                <p className="text-gray-800 font-mono">{showPassword ? secret.password : "••••••••"}</p>

                <div className="flex gap-2">
                  <button onClick={() => setShowPassword(!showPassword)} className="text-blue-600 hover:text-blue-800">
                    {showPassword ? (
                      <img src={EyeCloseIcon} alt="hide" width={18} height={18} />
                    ) : (
                      <img src={EyeIcon} alt="show" width={18} height={18} />
                    )}
                  </button>
                  {copied ? (
                    <>
                      <img src={copyCheckIcon} alt="copy password" width={18} height={18} className="text-green-600" />
                      Copied
                    </>
                  ) : (
                    <button
                      title="copy to clipboard"
                      onClick={handleCopyPassword}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <img src={copyIcon} alt="copy password" width={18} height={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {secret.url && (
            <div>
              <label className="text-sm font-medium text-gray-600">URL</label>
              <a
                href={secret.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline block"
              >
                {secret.url}
              </a>
            </div>
          )}

          {secret.notes && (
            <div>
              <label className="text-sm font-medium text-gray-600">Notes</label>
              <p className="text-gray-800 whitespace-pre-wrap">{secret.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretDetail;
