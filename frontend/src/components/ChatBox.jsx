import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import API_BASE from "../config/api.js";

function ChatBox({ subject }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const askQuestion = async () => {
    if (!question) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/ask`, {
        subject,
        question,
      });
      const botMessage = { role: "bot", text: res.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error getting answer" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col h-[70vh] w-full">
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 rounded-t-xl">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-3xl break-words shadow ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none prose prose-sm"
              }`}
            >
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t bg-white p-3 flex gap-2 rounded-b-xl">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={askQuestion}
          disabled={loading}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400 transition-all"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
