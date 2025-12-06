// src/services/vectorService.js
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib'
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers'
import fs from 'fs'
import path from 'path'

const indicesPath = path.join(process.cwd(), 'data')
const getIndexPath = (chatId) => path.join(indicesPath, `chat_${chatId}_index`)

let loadedStores = {}

async function getEmbeddings() {
  return new HuggingFaceTransformersEmbeddings({
    model: 'Xenova/all-MiniLM-L6-v2',
  })
}

export async function createOrLoadStore(chatId) {
  const indexPath = getIndexPath(chatId)
  const embeddings = await getEmbeddings()

  if (loadedStores[chatId]) return loadedStores[chatId]

  if (fs.existsSync(indexPath)) {
    const store = await HNSWLib.load(indexPath, embeddings)
    loadedStores[chatId] = store
    return store
  } else {
    // create empty store (we'll add docs later)
    const store = await HNSWLib.fromTexts(['__init__'], {}, embeddings)
    fs.mkdirSync(indicesPath, { recursive: true })
    await store.save(indexPath)
    loadedStores[chatId] = store
    return store
  }
}

export async function addChunksToStore(chatId, chunks) {
  const store = await createOrLoadStore(chatId)
  const embeddings = store.embeddings   // reuse
  await store.addDocuments(
    chunks.map(t => ({ pageContent: t, metadata: {} })),
    embeddings
  )
  await store.save(getIndexPath(chatId))
  return store
}

export async function getRetriever(chatId, k = 8) {
  const store = await createOrLoadStore(chatId)
  return store.asRetriever({ k })
}
