import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { storeEmbeddings } from "./vectorService.js";

export const processPDF = async (filePath, subject) => {
  try {
    // read PDF
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    // split into chunks (~1–2 pages each)
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(data.text);
    console.log(`PDF split into ${chunks.length} chunks for ${subject}`);

    // process in batches (to avoid OOM)
    const batchSize = 5;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      await storeEmbeddings(batch, subject, i > 0); // append after first batch
      console.log(`Processed batch ${i / batchSize + 1}`);
    }

    // delete uploaded file after processing
    fs.unlinkSync(filePath);

    return { success: true, message: `PDF processed for ${subject}` };
  } catch (err) {
    console.error("PDF processing error:", err);
    return { error: "Failed to process PDF" };
  }
};
