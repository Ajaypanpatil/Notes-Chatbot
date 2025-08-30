import { pipeline } from "@xenova/transformers";
import fs from "fs";
import path from "path";

// Path where transformers.js caches models
const modelPath = path.join(process.cwd(), "model_cache", "Xenova", "all-MiniLM-L6-v2");

const run = async () => {
  // Check if model is already downloaded
  if (fs.existsSync(modelPath)) {
    console.log("Model already cached, skipping download.");
    return;
  }

  console.log("⬇️ Downloading HuggingFace embedding model (Xenova/all-MiniLM-L6-v2)...");

  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  // Dummy inference to fully load model
  await embedder("test sentence");

  console.log("Model cached locally!");
};

run();
