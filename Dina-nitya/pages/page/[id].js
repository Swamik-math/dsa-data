import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function PageView() {
  const router = useRouter()
  const { id } = router.query
  const [page, setPage] = useState(null)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/pages/${id}`)
      .then(r => r.json())
      .then(setPage)
  }, [id])

  async function addBlock(e) {
    e.preventDefault()
    if (!text) return
    const res = await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId: id, type: 'text', content: text })
    })
    const block = await res.json()
    setPage(prev => ({ ...prev, blocks: [block, ...prev.blocks] }))
    setText('')
  }

  if (!page) return <div style={{padding:20}}>Loading...</div>

  return (
    <div style={{padding:20}}>
      <h1>{page.title || 'Untitled'}</h1>

      <form onSubmit={addBlock} style={{marginBottom:20}}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a block..." style={{padding:8, width:'60%'}} />
        <button type="submit" style={{marginLeft:8}}>Add</button>
      </form>

      <div>
        {page.blocks.length === 0 && <p>No blocks yet.</p>}
        {page.blocks.map(b => (
          <div key={b.id} style={{padding:8, border:'1px solid #eee', marginBottom:8}}>
            {b.type === 'text' ? <div>{b.content}</div> : <pre>{JSON.stringify(b)}</pre>}
          </div>
        ))}
      </div>
    </div>
  )
}
