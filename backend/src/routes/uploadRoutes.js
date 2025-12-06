import express from 'express'
import multer from 'multer'
import db from '../db.js'
import { processPDFForChat } from '../services/pdfService.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

// POST /upload/:chatId
router.post('/:chatId', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded. Use key 'file'." })
    const { chatId } = req.params
    const chat = db.data.chats.find(c => c.id === chatId)
    if (!chat) return res.status(404).json({ error: 'Chat not found' })

    await processPDFForChat(req.file.path, chatId, req.file.originalname)

    chat.updatedAt = new Date().toISOString()
    await db.write()

    res.json({ success: true, message: `PDF added to chat '${chat.name}'` })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Failed to process PDF' })
  }
})

export default router
