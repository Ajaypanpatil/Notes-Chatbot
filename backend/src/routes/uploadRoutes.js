import express from "express";
import multer from "multer";
import { processPDF } from "../services/pdfService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /upload/:subject
router.post("/:subject", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Use key 'file' in form-data." });
    }
console.log("Incoming file:", req.file);

    const { subject } = req.params;
    await processPDF(req.file.path, subject);
    res.json({ success: true, message: `PDF processed for ${subject}` });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});


export default router;
