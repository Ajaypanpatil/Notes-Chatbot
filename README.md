# 📘 Notes-Chatbot

[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express-black?logo=express&logoColor=white)](https://expressjs.com/)
[![LangChain](https://img.shields.io/badge/AI-LangChain-orange)](https://www.langchain.com/)
[![HuggingFace](https://img.shields.io/badge/Embeddings-HuggingFace-yellow?logo=huggingface&logoColor=white)](https://huggingface.co/)
[![Google Gemini](https://img.shields.io/badge/LLM-Google%20Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/gemini-api)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)

An **AI-powered study assistant chatbot** that helps students and professionals work with **long PDFs (300+ pages)** such as notes, books, or research papers.  

Upload a PDF → Ask questions → Get **structured, context-based answers** (bullet points, steps, explanations) — all grounded in your notes.

---

## 🚀 Features

- Upload any subject notes or book (even 300+ pages PDF).
- Ask natural language questions.
- Get **detailed, structured answers** (not generic AI guesses).
- Works seamlessly for subjects like **Cyber Security**, **Big Data Analytics**, and more.
- Built on **Retrieval-Augmented Generation (RAG)** pipeline.

---

## 🛠 Tech Stack

- **Frontend:** React + Vite + TailwindCSS (deployed on Vercel)  
- **Backend:** Node.js + Express (deployed on Render)  
- **Vector DB:** HNSWLib (via LangChain)  
- **Embeddings:** HuggingFace Transformers (all-MiniLM-L6-v2)  
- **LLM:** Google GenAI (Gemini API)  

---

## ⚙️ How it Works

1. **Chunking** → PDF is split into overlapping chunks (~1000 chars).  
2. **Embeddings** → Each chunk is converted into numerical vectors using HuggingFace models.  
3. **Vector Store** → Embeddings are stored in HNSWLib for fast similarity search.  
4. **Retriever + LLM** → When you ask a question, the retriever fetches relevant chunks → Gemini answers based on your notes only.  

This ensures **contextual, accurate, and memory-efficient answers**.

---

## ⚡ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Ajaypanpatil/Notes-Chatbot.git
cd Notes-Chatbot

```
### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a .env file in /backend:

```bash
PORT=5000
GEMINI_API_KEY=your_api_key_here
```

Start backend:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```

Create a .env file in /frontend:
```bash
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```
---

📸 Screenshots

![Landing Page](<Notes Chatbot Demo 1.png>) 

![File Upload](<Notes Chatbot Demo 2.png>) 

![Chat Start](<Notes Chatbot Demo 3.png>) 

![alt text](<Notes Chatbot Demo 4.png>)

<video controls src="Notes Chatbot Demo.mp4" title="Note ChatBot Demo"></video>


---

## 👤 Author
**Ajay Santosh Panpatil**

[![GitHub](https://img.shields.io/badge/GitHub-Ajaypanpatil-181717?logo=github)](https://github.com/Ajaypanpatil)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ajay%20Panpatil-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ajay-panpatil-9413572a1/)  
