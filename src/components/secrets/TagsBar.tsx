import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import DrawTags from "../common/DrawTags";
import { Tag } from "../../contexts/secretContext/types";
import { MinusCircleIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import useSecrets from "../../hooks/useSecrets";

interface TagsBarProps {
  allTags: Tag[];
  selectedTags?: string[];
  onTagClick: (tagName: string) => void;
}

export default function TagsBar({ selectedTags, onTagClick, allTags }: TagsBarProps) {
  const { addTag, deleteTag, updateTag } = useSecrets();
  const [newTag, setNewTag] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);

  const colors = ["red", "green", "blue", "yellow", "violet", "pink", "indigo", "gray", "teal", "orange"];

  const currentColors = allTags.map((t) => t.color);
  const availableColors = colors.filter((color) => !currentColors.includes(color));

  const addCustomTag = async () => {
    // todo : need assign color dynamically
    const currentTags = allTags.map((t) => t.name);

    if (newTag.trim() === "") return;
    if (currentTags.includes(newTag.trim())) {
      alert("Tag already exists!");
      return;
    }

    if (availableColors.length === 0) {
      alert("No more rooms available for new tags!");
      return;
    }

    const tagToAdd: Tag = {
      name: newTag.trim()[0].toUpperCase() + newTag.trim().slice(1),
      color: availableColors[0],
    };

    await addTag(tagToAdd);
    alert(`Tag "${tagToAdd.name}" added successfully!`);
    setNewTag("");
    setShowNewTagInput(false);
  };

  const drawEditColorsForContextMenu = () => {
    const contextMenuActions: { label: ReactNode; cb: (tag: Tag) => void }[] = availableColors.map((color) => ({
      label: (
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span>{`Change to ${color.charAt(0).toUpperCase() + color.slice(1)}`}</span>
        </div>
      ),
      cb: async (tag) => {
        await updateTag(tag.name, { ...tag, color });
        alert(`Tag "${tag.name}" color changed to ${color} successfully!`);
      },
    }));
    return contextMenuActions;
  };

  return (
    <div
      className="mb-6 flex flex-col gap-3"
      onClick={() => {
        if (showNewTagInput) setShowNewTagInput(false);
      }}
      onBlur={() => {
        if (showNewTagInput && !newTag) setShowNewTagInput(false);
      }}
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => onTagClick("all-tags")}
          className={`px-3 py-1 rounded-full border text-sm 
            ${selectedTags?.length === 0 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"}
          `}
        >
          All
        </button>

        <DrawTags
          onClick={onTagClick}
          tagsData={allTags}
          selectedTags={selectedTags}
          onRightClickActions={[
            ...drawEditColorsForContextMenu(),
            {
              label: (
                <span className="mt-1 border-top-1 flex items-center gap-2 text-red-600">
                  <TrashIcon width={14} height={14} />
                  <span>Delete</span>
                </span>
              ),
              cb: async (tag) => await deleteTag(tag.name),
            },
          ]}
        />
        {showNewTagInput ? (
          <MinusCircleIcon
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => setShowNewTagInput(false)}
          />
        ) : (
          <PlusCircleIcon
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => setShowNewTagInput(true)}
          />
        )}
      </div>

      {/* Add new tag */}
      {showNewTagInput && (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
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
      )}
    </div>
  );
}
