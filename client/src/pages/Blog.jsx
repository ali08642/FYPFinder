import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return { headers: { Authorization: `Bearer ${user?.token}` } }
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ title: '', content: '' })
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    axios.get('http://localhost:5000/api/blog').then(res => setPosts(res.data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const res = await axios.post('http://localhost:5000/api/blog', form, getAuthHeader())
    setPosts([res.data, ...posts])
    setForm({ title: '', content: '' })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Blog</h1>
      {user?.role === 'admin' && (
        <form onSubmit={handleCreate} className="mb-8 space-y-3">
          <input placeholder="Post title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 rounded" required />
          <textarea placeholder="Content" value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="w-full border p-2 rounded" rows={4} required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Publish
          </button>
        </form>
      )}
      {posts.length === 0 && <p className="text-gray-500">No posts yet.</p>}
      {posts.map(p => (
        <div key={p._id} className="border p-4 rounded bg-white mb-4">
          <h2 className="text-lg font-semibold">{p.title}</h2>
          <p className="text-xs text-gray-400 mb-2">By {p.author?.name}</p>
          <p className="text-sm text-gray-700">{p.content}</p>
        </div>
      ))}
    </div>
  )
}