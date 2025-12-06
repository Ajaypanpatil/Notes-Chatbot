// src/services/llmService.js
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { getRetriever } from './vectorService.js'
import db from '../db.js'

const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful MCA study assistant chatbot.

Answer ONLY using the provided context below.  
Do not add knowledge outside of the notes.  

### Formatting Rules:
- Always answer in **structured format** (not paragraphs).  
- Use bullet points (•) or numbers (1., 2., 3.) to organize answers.  
- For definitions → use **bold headings** then explain.  
- If penalties, case studies, or examples exist → show them as **sub-bullets**.  
- If the answer is not in the notes, reply exactly: "Not available in notes."

---

CONTEXT:
{context}

QUESTION:
{input}

STRUCTURED DETAILED ANSWER:
`)

export async function askInChat(chatId, question) {
  const retriever = await getRetriever(chatId, 6)

  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    temperature: 0.2,
  })

  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  })

  const retrievalChain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  })

  const response = await retrievalChain.invoke({ input: question })
  const answer = response.answer || 'Not available in notes.'

  // persist messages
  const now = new Date().toISOString()
  db.data.messages.push({ id: crypto.randomUUID(), chatId, role: 'user', text: question, createdAt: now })
  db.data.messages.push({ id: crypto.randomUUID(), chatId, role: 'bot',  text: answer,   createdAt: now })
  // also bump chat updatedAt
  const chat = db.data.chats.find(c => c.id === chatId)
  if (chat) chat.updatedAt = now
  await db.write()

  return answer
}
