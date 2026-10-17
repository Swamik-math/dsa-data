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
  if (req.method === 'GET') {
    const db = await readDB()
    res.status(200).json(db.pages)
    return
  }

  if (req.method === 'POST') {
    const { title } = req.body
    const db = await readDB()
    const page = { id: uuidv4(), title: title || 'Untitled', blocks: [] }
    db.pages.unshift(page)
    await writeDB(db)
    res.status(201).json(page)
    return
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
