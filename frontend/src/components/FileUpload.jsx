import { useState } from "react";
import { uploadPdf } from "../lib/api";

export default function FileUpload({ chat }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!chat) return alert("Select or create a chat first");
    if (!file) return alert("Choose a PDF");
    setLoading(true);
    try {
      const res = await uploadPdf(chat.id, file);
      alert(res.message || "Uploaded");
      setFile(null);
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <label className="text-xs font-semibold text-gray-600">
        Upload PDFs into <span className="text-blue-600">{chat ? chat.name : "—"}</span>
      </label>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-sm border border-gray-300 rounded-lg p-1"
      />
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="bg-blue-600 text-white py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}
