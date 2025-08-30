import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers"; // ✅ new import
import fs from "fs";
import path from "path";

const indicesPath = path.join(process.cwd(), "data");
let loadedStores = {};

const getIndexPath = (subject) => path.join(indicesPath, `${subject}_index`);

export const storeEmbeddings = async (chunks, subject) => {
  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2", 
  });

  const vectorStore = await HNSWLib.fromTexts(chunks, {}, embeddings);

  fs.mkdirSync(indicesPath, { recursive: true });
  await vectorStore.save(getIndexPath(subject));
  loadedStores[subject] = vectorStore;

  console.log(`Saved HNSWLib index for ${subject}`);
};

export const loadVectorStore = async (subject) => {
  if (loadedStores[subject]) return loadedStores[subject];

  const indexPath = getIndexPath(subject);
  if (fs.existsSync(indexPath)) {
    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: "Xenova/all-MiniLM-L6-v2",
    });
    const vectorStore = await HNSWLib.load(indexPath, embeddings);
    loadedStores[subject] = vectorStore;
    return vectorStore;
  } else {
    throw new Error(`No index found for ${subject}. Upload a PDF first.`);
  }
};


export const getRetriever = async (subject, k = 8) => {
  const store = await loadVectorStore(subject);
  return store.asRetriever(k); 
};
