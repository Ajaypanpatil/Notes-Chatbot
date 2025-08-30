import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { loadVectorStore } from "./vectorService.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

export const askQuestion = async (subject, question) => {

  const vectorStore = await loadVectorStore(subject);
  const retriever = vectorStore.asRetriever({ k: 6 }); 

  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.0-flash",
    temperature: 0.2, 
  });

  // Custom detailed prompt
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
`);

  // Combine retrieved docs into LLM prompt
  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  // Create retrieval chain
  const retrievalChain = await createRetrievalChain({
    combineDocsChain,
    retriever,
  });

  // Run chain
  const response = await retrievalChain.invoke({
    input: question,
  });

  return response.answer; 
};
