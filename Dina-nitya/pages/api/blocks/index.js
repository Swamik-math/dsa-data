import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

async function readDB() {
  const txt = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(txt)
}
async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { pageId, type, content } = req.body
  if (!pageId) return res.status(400).json({ error: 'pageId required' })

  const db = await readDB()
  const page = db.pages.find(p => p.id === pageId)
  if (!page) return res.status(404).json({ error: 'Page not found' })

  const block = { id: uuidv4(), type: type || 'text', content: content || '' }
  page.blocks.unshift(block)
  await writeDB(db)

  res.status(201).json(block)
}
