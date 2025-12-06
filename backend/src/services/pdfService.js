// src/services/pdfService.js
import fs from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { addChunksToStore } from './vectorService.js'
import db from '../db.js'

export const processPDFForChat = async (filePath, chatId, originalName) => {
  const dataBuffer = fs.readFileSync(filePath)
  const data = await pdf(dataBuffer)

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const chunks = await splitter.splitText(data.text || '')

  await addChunksToStore(chatId, chunks)

  // record doc in db
  db.data.docs.push({
    id: crypto.randomUUID(),
    chatId,
    filename: originalName,
    pages: data.numpages || null,
    chunks: chunks.length,
    createdAt: new Date().toISOString(),
  })
  await db.write()

  fs.unlinkSync(filePath) // clean temp upload
}
