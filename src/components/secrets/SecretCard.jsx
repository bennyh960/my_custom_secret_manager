const SecretCard = ({ secret, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800">{secret.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => onView(secret)} className="text-blue-600 hover:text-blue-800">
            👁️
          </button>
          <button onClick={() => onEdit(secret)} className="text-green-600 hover:text-green-800">
            ✏️
          </button>
          <button onClick={() => onDelete(secret.id)} className="text-red-600 hover:text-red-800">
            🗑️
          </button>
        </div>
      </div>
      {secret.username && <p className="text-sm text-gray-600">👤 {secret.username}</p>}
      {secret.url && (
        <a
          href={secret.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          🔗 {secret.url}
        </a>
      )}
    </div>
  );
};

export default SecretCard;
