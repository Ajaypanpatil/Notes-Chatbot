import express from 'express'
import { askInChat } from '../services/llmService.js'

const router = express.Router()

// POST /ask/:chatId   { question }
router.post('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params
    const { question } = req.body
    if (!question) return res.status(400).json({ error: 'question is required' })
    const answer = await askInChat(chatId, question)
    res.json({ answer })
  } catch (err) {
    console.error('Ask error:', err)
    res.status(500).json({ error: 'Failed to answer question' })
  }
})

export default router
