import { useEffect, useState } from "react";
import { listChats, createChat, deleteChat } from "../lib/api";  // Import the deleteChat function
import { FiTrash2 } from "react-icons/fi";  // Import trash icon

export default function ChatList({ selectedChat, onSelect }) {
  const [chats, setChats] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch list of chats
  async function refresh() {
    const { chats } = await listChats();
    setChats(chats);
  }
  
  // Load chats when component mounts
  useEffect(() => {
    refresh();
  }, []);

  // Handle chat creation
  async function handleCreate() {
    if (!name.trim()) return alert("Enter chat name");
    setLoading(true);
    try {
      const { chat } = await createChat(name.trim());
      setName("");  // Clear input field after creation
      await refresh();  // Refresh chat list
      onSelect(chat);  // Auto-select the newly created chat
    } finally {
      setLoading(false);
    }
  }

  // Handle chat deletion
  async function handleDelete(chatId) {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      try {
        await deleteChat(chatId);  // Call the delete API function
        await refresh();  // Refresh the chat list after deletion
      } catch (error) {
        alert("Failed to delete the chat.");
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Chat creation section */}
      <div className="flex gap-2 mb-4 px-4 py-2 bg-gray-100 rounded-lg">
        <input
          className="border rounded-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New chat (e.g. Big Data)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Chat list */}
      <div className="space-y-1 overflow-y-auto max-h-[65vh] px-4">
        {chats.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className={`relative cursor-pointer rounded-lg p-2 text-left transition-all ${
              selectedChat?.id === c.id
                ? "bg-blue-100 border border-blue-400"
                : "hover:bg-gray-200"
            }`}
          >
            <div className="font-medium text-gray-800">{c.name}</div>
            <div className="text-xs text-gray-500">
              {new Date(c.updatedAt || c.createdAt).toLocaleString()}
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();  // Prevent triggering the chat selection
                handleDelete(c.id);
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-all"
              title="Delete Chat"
              disabled={loading}  // Disable delete button while loading
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
