import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChatBox from "./components/ChatBox";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function App() {
  const [subject, setSubject] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-200">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          📘 Notes Chatbot
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 w-full max-w-6xl mx-auto">
        <FileUpload onUpload={(sub) => setSubject(sub)} />
        {subject && (
          <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">
              Chatting with:{" "}
              <span className="text-blue-700 font-bold">{subject}</span>
            </h2>
            <ChatBox subject={subject} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-4 text-sm flex justify-center items-center gap-4">
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
