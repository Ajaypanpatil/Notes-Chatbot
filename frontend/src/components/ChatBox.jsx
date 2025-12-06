import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ask, getMessages, uploadPdf } from "../lib/api";  // import uploadPdf
import { FiPaperclip } from "react-icons/fi";  // Add paperclip icon

export default function ChatBox({ chat }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);  // State for file upload status
  const fileInputRef = useRef(null);
  const endRef = useRef(null);

  // Load message history when chat changes
  useEffect(() => {
    async function load() {
      if (!chat) return setMessages([]);
      const { messages } = await getMessages(chat.id);
      setMessages(messages);
    }
    load();
  }, [chat?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle sending a message
  async function send() {
    if (!question.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    setQuestion("");
    setLoading(true);
    try {
      const { answer } = await ask(chat.id, userMsg.text);
      setMessages((m) => [...m, { id: Date.now(), role: "bot", text: answer }]);
    } catch {
      setMessages((m) => [...m, { id: Date.now(), role: "bot", text: "Error getting answer" }]);
    } finally {
      setLoading(false);
    }
  }

  // Function to handle file selection
  function openFilePicker() {
    if (!chat) return alert("Select a chat first");
    fileInputRef.current?.click();
  }

  // Function to handle file upload
  async function onFilePicked(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      e.target.value = ""; // Reset the picker
      return;
    }

    setUploading(true);  // Set uploading to true while file is being uploaded
    try {
      const res = await uploadPdf(chat.id, file);
      // Show a system message in the chat
      setMessages((m) => [
        ...m,
        {
          id: `upload-${Date.now()}`,
          role: "bot",
          text: `📎 **Uploaded:** ${file.name}\n\n_${res.message || "File added to this chat."}_`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        {
          id: `upload-err-${Date.now()}`,
          role: "bot",
          text: "❌ Upload failed",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setUploading(false);
      e.target.value = "";  // Reset file picker
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b bg-white px-5 py-3 text-gray-700 font-medium shadow-sm">
        Chat: <span className="text-blue-600 font-semibold">{chat.name}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-lg break-words ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white border rounded-bl-none"
              }`}
            >
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input bar with file upload and question input */}
      <div className="border-t bg-white p-3 flex gap-2 items-center">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onFilePicked}
        />

        {/* Paperclip button */}
        <button
          onClick={openFilePicker}
          title="Upload PDF"
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          disabled={!chat || uploading}
        >
          <FiPaperclip className="text-gray-700" />
        </button>

        {/* Text input for asking questions */}
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={uploading ? "Uploading PDF..." : "Ask a question..."}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && !uploading && send()}
          disabled={uploading}
        />

        {/* Ask button */}
        <button
          onClick={send}
          disabled={loading || uploading}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
