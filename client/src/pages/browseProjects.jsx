import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import projectService from '../services/projectService'

export default function BrowseProjects() {
  const [projects, setProjects] = useState([])
  const [message, setMessage] = useState('')
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    projectService.getAllProjects().then(setProjects)
  }, [])

  const handleApply = async (projectId) => {
    try {
      await projectService.applyToProject(projectId, message)
      alert('Applied successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Browse Projects</h1>
      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p._id} className="border p-4 rounded shadow-sm bg-white">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-gray-600 text-sm mb-1">{p.description}</p>
            <p className="text-sm">Domain: <span className="font-medium">{p.domain}</span></p>
            <p className="text-sm">Supervisor: <span className="font-medium">{p.supervisor?.name}</span></p>
            <p className="text-sm mb-3">Team Size: {p.teamSize}</p>
            {user?.role === 'student' && (
              <button
                onClick={() => handleApply(p._id)}
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}