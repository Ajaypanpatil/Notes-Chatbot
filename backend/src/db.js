// src/db.js
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'

const dataDir = path.join(process.cwd(), 'data')
fs.mkdirSync(dataDir, { recursive: true })

const file = path.join(dataDir, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter, { chats: [], messages: [], docs: [] })

export async function initDB() {
  await db.read()
  db.data ||= { chats: [], messages: [], docs: [] }
  await db.write()
}

export default db
