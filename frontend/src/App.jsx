import { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import FileUpload from "./components/FileUpload";
import ChatBox from "./components/ChatBox";
import { FaGithub } from "react-icons/fa";

function App() {
  const [selectedChat, setSelectedChat] = useState(null);

  // Remember last chat
  useEffect(() => {
    const saved = localStorage.getItem("selectedChat");
    if (saved) setSelectedChat(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (selectedChat)
      localStorage.setItem("selectedChat", JSON.stringify(selectedChat));
  }, [selectedChat]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white flex items-center justify-center py-3 shadow-md">
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
          📘 Notes Chatbot — <span className="font-light">Smart Study Assistant</span>
        </h1>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r flex flex-col justify-between shadow-md">
          <div className="overflow-y-auto p-4 space-y-4">
            <ChatList selectedChat={selectedChat} onSelect={setSelectedChat} />
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-gray-50">
          {selectedChat ? (
            <ChatBox chat={selectedChat} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Welcome 👋</p>
                <p>Create or select a chat to begin</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-3 text-sm flex justify-center items-center gap-3">
        <span>
          Built by <span className="font-semibold text-white">Ajay Panpatil</span>
        </span>
        <a
          href="https://github.com/Ajaypanpatil"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-white transition"
        >
          <FaGithub size={18} /> GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
