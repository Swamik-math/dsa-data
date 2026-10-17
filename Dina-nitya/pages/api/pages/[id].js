import { promises as fs } from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

async function readDB() {
  const txt = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(txt)
}

export default async function handler(req, res) {
  const { id } = req.query
  const db = await readDB()
  const page = db.pages.find(p => p.id === id)
  if (!page) return res.status(404).json({ error: 'Page not found' })
  res.status(200).json(page)
}
