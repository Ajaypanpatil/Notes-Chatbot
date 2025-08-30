import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { storeEmbeddings } from "./vectorService.js";

export const processPDF = async (filePath, subject) => {
  // read PDF
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);

  // split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,  // ~1-2 pages
    chunkOverlap: 200
  });

  const chunks = await splitter.splitText(data.text);
  console.log(`PDF split into ${chunks.length} chunks for ${subject}`);

  // save embeddings into FAISS
  await storeEmbeddings(chunks, subject);

  // delete uploaded file after processing
  fs.unlinkSync(filePath);
};
