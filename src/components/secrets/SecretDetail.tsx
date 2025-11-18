import { useMemo, useState } from "react";
import { Secret } from "../../contexts/secretContext/types";
import { ClipboardIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import DrawTags from "../common/DrawTags";

interface ISecretDetailProps {
  secret: Secret;
  onClose: () => void;
  tags: { name: string; color: string }[];
}

const SecretDetail = ({ secret, onClose, tags }: ISecretDetailProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = async () => {
    await navigator.clipboard.writeText(secret.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // prepare tags data
  const secretTags = useMemo(() => tags.filter((t) => secret.tags.includes(t.name)), [tags, secret.tags]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white rounded-2xl shadow-2xl w-full max-w-lg
          p-6 sm:p-7
          animate-fadeIn
        "
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800 leading-tight break-words">{secret.title}</h2>

          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none">
            ×
          </button>
        </div>

        {/* Tags */}
        {secretTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <DrawTags tagsData={secretTags} />
          </div>
        )}

        {/* Content */}
        <div className="space-y-5">
          {/* Username */}
          {secret.username && (
            <div>
              <label className="text-sm font-medium text-gray-600">Username</label>
              <p className="text-gray-800 font-medium break-all">{secret.username}</p>
            </div>
          )}

          {/* Password */}
          {secret.password && (
            <div className="relative">
              <label className="text-sm font-medium text-gray-600">Password</label>

              <div
                className="
                flex items-center justify-between
                mt-1 px-3 py-2
                rounded-lg border border-gray-300
                bg-gray-50
                font-mono
              "
              >
                <span className="text-gray-900 select-text break-all">
                  {showPassword ? secret.password : "••••••••••••"}
                </span>

                <div className="flex items-center gap-3 ml-3">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title={showPassword ? "Hide" : "Show"}
                  >
                    {showPassword ? <EyeSlashIcon width={20} /> : <EyeIcon width={20} />}
                  </button>

                  <button
                    onClick={handleCopyPassword}
                    className="text-blue-600 hover:text-blue-800 transition relative"
                    title="Copy password"
                  >
                    <ClipboardIcon width={20} />

                    {copied && (
                      <span
                        className="
                          absolute -top-8 left-1/2 -translate-x-1/2
                          bg-black text-white px-2 py-1
                          text-xs rounded-md shadow
                          animate-fadeIn
                        "
                      >
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* URL */}
          {secret.url && (
            <div>
              <label className="text-sm font-medium text-gray-600">URL</label>
              <a
                href={secret.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all block font-medium"
              >
                {secret.url}
              </a>
            </div>
          )}

          {/* Notes */}
          {secret.notes && (
            <div>
              <label className="text-sm font-medium text-gray-600">Notes</label>
              <p className="text-gray-800 whitespace-pre-wrap mt-1 break-words">{secret.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretDetail;
