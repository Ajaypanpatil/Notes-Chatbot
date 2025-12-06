import express from 'express';
import db from '../db.js';  // The local database (in-memory or file-based)
import { nanoid } from 'nanoid';

const router = express.Router();

// POST /chats  { name: "My DAA Notes" }
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const id = nanoid(12);
  const now = new Date().toISOString();
  const chat = { id, name, createdAt: now, updatedAt: now };
  db.data.chats.push(chat);
  await db.write();
  res.json({ chat });
});

// GET /chats  -> list chats
router.get('/', async (_req, res) => {
  const chats = [...db.data.chats].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  res.json({ chats });
});

// GET /chats/:id/messages
router.get('/:id/messages', async (req, res) => {
  const { id } = req.params;
  const messages = db.data.messages.filter(m => m.chatId === id);
  res.json({ messages });
});

// DELETE /chats/:id  -> delete a chat by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Find the index of the chat by id
  const chatIndex = db.data.chats.findIndex(chat => chat.id === id);
  if (chatIndex === -1) {
    return res.status(404).json({ error: 'Chat not found' });
  }

  // Remove the chat from the array
  db.data.chats.splice(chatIndex, 1);

  // Optional: You can also delete associated messages if necessary
  db.data.messages = db.data.messages.filter(message => message.chatId !== id);

  // Write the updated data back to the database (JSON file)
  await db.write();

  res.json({ message: 'Chat deleted successfully' });
});

export default router;
