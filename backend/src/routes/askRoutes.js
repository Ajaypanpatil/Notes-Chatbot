import express from "express";
import { askQuestion } from "../services/geminiService.js";

const router = express.Router();

// POST /ask
router.post("/", async (req, res) => {
  try {
    const { subject, question } = req.body;
    const answer = await askQuestion(subject, question);
    res.json({ answer });
  } catch (err) {
    console.error("Ask error:", err);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

export default router;
