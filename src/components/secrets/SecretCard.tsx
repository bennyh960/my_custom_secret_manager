import { PencilIcon, EyeIcon, TrashIcon, LinkIcon, UserIcon } from "@heroicons/react/24/outline";
import { Secret } from "../../contexts/secretContext/types";
import { Dispatch, SetStateAction, useMemo } from "react";
import DrawTags from "../common/DrawTags";

interface ISecretCardProps {
  secret: Secret;
  onEdit: (secret: Secret) => void;
  onDelete: (id: string) => void;
  onView: Dispatch<SetStateAction<Secret | null>>;
  tags: { name: string; color: string }[];
}

const SecretCard = ({ secret, onEdit, onDelete, onView, tags }: ISecretCardProps) => {
  // Filter only tags this secret has
  const secretTags = useMemo(() => tags.filter((t) => secret.tags.includes(t.name)), [tags, secret.tags]);

  return (
    <div
      className="
        bg-white rounded-xl shadow-sm 
        hover:shadow-md transition-all 
        p-4 
        flex flex-col
        justify-between
        h-full
      "
    >
      {/* TOP: Title + Actions */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-900 leading-tight truncate max-w-[70%]">{secret.title}</h3>

        <div className="flex gap-1">
          <button
            onClick={() => onView(secret)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors"
          >
            <EyeIcon className="h-5 w-5 text-blue-600" />
          </button>

          <button
            onClick={() => onEdit(secret)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-green-100 transition-colors"
          >
            <PencilIcon className="h-5 w-5 text-green-600" />
          </button>

          <button
            onClick={() => onDelete(secret.id!)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 transition-colors"
          >
            <TrashIcon className="h-5 w-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* MIDDLE SECTION: Username + URL */}
      <div className="space-y-2 mb-4">
        {/* Username */}
        {secret.username && (
          <div className="flex items-center gap-2 text-gray-700 text-sm truncate">
            <UserIcon className="h-5 w-5 text-gray-400" />
            <span className="truncate">{secret.username}</span>
          </div>
        )}

        {/* URL */}
        {secret.url && (
          <a
            href={secret.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 text-sm hover:underline truncate"
          >
            <LinkIcon className="h-5 w-5 text-gray-400" />
            <span className="truncate">{secret.url}</span>
          </a>
        )}
      </div>

      {/* BOTTOM SECTION: Tags */}
      <div className="mt-auto pt-2 border-t border-gray-100">
        {secretTags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            <DrawTags tagsData={secretTags} />
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic mt-2">No tags</p>
        )}
      </div>
    </div>
  );
};

export default SecretCard;
