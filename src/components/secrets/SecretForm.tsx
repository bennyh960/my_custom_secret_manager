import { CSSProperties, KeyboardEvent, useCallback, useState } from "react";
import { Secret } from "../../contexts/secretContext/types";

interface ISecretFormProps {
  secret: Secret | null;
  onSave: (secret: Secret) => Promise<void>;
  onCancel: () => void;
}

const SecretForm = ({ secret, onSave, onCancel }: ISecretFormProps) => {
  const [formData, setFormData] = useState<Secret>(
    secret || { title: "", username: "", password: "", url: "", notes: "", tags: [] }
  );
  const [dirStyle, setDirStyle] = useState<CSSProperties["direction"]>("ltr");

  const handleSubmit = () => {
    if (formData.title && formData.password) {
      onSave(formData);
    } else {
      alert("Title and Password are required fields.");
    }
  };

  const changeInputDirection = useCallback((e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!e.ctrlKey) return;

    // right shift + ctrl
    if (e.shiftKey && e.code === "ShiftRight") {
      // @ts-ignore
      e.target.style.direction = "rtl";
      setDirStyle("rtl");
    }

    // left shift + ctrl
    if (e.shiftKey && e.code === "ShiftLeft") {
      // @ts-ignore
      e.target.style.direction = "ltr";
      setDirStyle("ltr");
    }
  }, []);

  return (
    <div className="space-y-4" style={{ direction: dirStyle }}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          onKeyDown={changeInputDirection}
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          onKeyDown={changeInputDirection}
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          onKeyDown={changeInputDirection}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
        <input
          type="url"
          onKeyDown={changeInputDirection}
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onKeyDown={changeInputDirection}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Secret
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SecretForm;
