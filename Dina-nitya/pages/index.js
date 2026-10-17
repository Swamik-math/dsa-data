import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [pages, setPages] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetch('/api/pages')
      .then(r => r.json())
      .then(setPages)
  }, [])

  async function createPage(e) {
    e.preventDefault()
    if (!title) return
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
    const page = await res.json()
    setPages(prev => [page, ...prev])
    setTitle('')
  }

  return (
    <div className="container">
      <h1>Dina — Notion-like (minimal)</h1>
      <form onSubmit={createPage} className="create-form">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New page title" />
        <button type="submit">Create Page</button>
      </form>

      <h2>Pages</h2>
      <ul>
        {pages.map(p => (
          <li key={p.id}>
            <Link href={`/page/${p.id}`}><a>{p.title || 'Untitled'}</a></Link>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .container { padding: 2rem }
        .create-form { margin-bottom: 1rem }
        input { padding: .5rem; margin-right:.5rem }
      `}</style>
    </div>
  )
}
