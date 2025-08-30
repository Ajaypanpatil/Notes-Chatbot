import { useState } from "react";
import axios from "axios";
import API_BASE from "../config/api.js";

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !subject) {
      alert("Please select subject and PDF");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/upload/${subject}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(res.data.message);
      onUpload(subject);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-4 border border-gray-200">
      <input
        type="text"
        placeholder="Enter subject (e.g. bigdata)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border border-gray-300 px-2 py-2 rounded-lg w-full sm:w-auto"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400 transition-all"
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}

export default FileUpload;
