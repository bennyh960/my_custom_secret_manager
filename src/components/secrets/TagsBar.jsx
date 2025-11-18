import { useState } from "react";

const DEFAULT_TAGS = ["Work", "Private", "Account", "Programs", "Social"];

export default function TagsBar({ selectedTag, setSelectedTag }) {
  const [newTag, setNewTag] = useState("");

  //   const addCustomTag = () => {
  //     if (!newTag.trim()) return;
  //     const t = newTag.trim();
  //     if (!customTags.includes(t)) setCustomTags([...customTags, t]);
  //     setNewTag("");
  //   };
  const addCustomTag = () => {};

  const allTags = [...DEFAULT_TAGS];

  return (
    <div className="mb-6 flex flex-col gap-3">
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded-full border text-sm 
            ${selectedTag === null ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"}
          `}
        >
          All
        </button>

        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full border text-sm capitalize 
              ${selectedTag === tag ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"}
            `}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Add new tag */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add new tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="px-3 py-2 border rounded-lg flex-1"
        />
        <button onClick={addCustomTag} className="px-4 py-2 bg-gray-800 text-white rounded-lg">
          Add
        </button>
      </div>
    </div>
  );
}
