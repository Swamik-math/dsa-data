# Dina Notion-like (Minimal)

A minimal Notion-like app scaffold built with Next.js.

Quick start (PowerShell):

```powershell
# install
npm install

# run dev server
npm run dev
``` 

Open http://localhost:3000

What this includes:
- Next.js frontend pages (`/`, `/page/[id]`)
- Simple file-backed API in `pages/api` using `data/db.json`
- Minimal UI to create pages and add blocks

Notes:
- This is a minimal prototype to get started. For production, use a proper DB (Postgres/SQLite with Prisma), authentication, and a real-time layer (WebSockets).
