import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import projectService from '../services/projectService'

export default function BrowseProjects() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState('All')
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    projectService.getAllProjects().then(setProjects)
  }, [])

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchDomain = domain === 'All' || p.domain === domain
    return matchSearch && matchDomain
  })

  const handleApply = async (projectId) => {
    try {
      await projectService.applyToProject(projectId, '')
      alert('Applied successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Browse Projects</h1>
      <div className="flex gap-3 mb-6">
        <input
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select value={domain} onChange={(e) => setDomain(e.target.value)}
          className="border p-2 rounded">
          <option>All</option>
          <option>AI</option>
          <option>Web</option>
          <option>Mobile</option>
          <option>Cybersecurity</option>
          <option>Other</option>
        </select>
      </div>
      <div className="grid gap-4">
        {filtered.length === 0 && <p className="text-gray-500">No projects found.</p>}
        {filtered.map((p) => (
          <div key={p._id} className="border p-4 rounded bg-white shadow-sm">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-gray-600 text-sm mb-1">{p.description}</p>
            <p className="text-sm">Domain: <span className="font-medium">{p.domain}</span></p>
            <p className="text-sm">Supervisor: <span className="font-medium">{p.supervisor?.name}</span></p>
            <p className="text-sm mb-3">Team Size: {p.teamSize}</p>
            {user?.role === 'student' && (
              <button onClick={() => handleApply(p._id)}
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}