// src/server.js (or index.js if that's where app.listen lives)
import dotenv from 'dotenv'
import app from './app.js'
import { initDB } from './db.js'

dotenv.config()
const PORT = process.env.PORT || 5000

await initDB()

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
})
