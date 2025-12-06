import express from 'express'
import cors from 'cors'
import uploadRoutes from './routes/uploadRoutes.js'
import askRoutes from './routes/askRoutes.js'
import chatsRoutes from './routes/chatsRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/chats', chatsRoutes)   // NEW
app.use('/upload', uploadRoutes)
app.use('/ask', askRoutes)

app.get('/healthz', (_req, res) => res.json({ status: 'ok' }))

export default app
