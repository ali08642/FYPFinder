import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import projectService from '../services/projectService'

export default function MyProjects() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    projectService.getMyProjects().then(setProjects)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      {projects.length === 0 && <p className="text-gray-500">No projects posted yet.</p>}
      {projects.map((p) => (
        <div key={p._id} className="border p-4 rounded bg-white mb-3">
          <p className="font-medium">{p.title}</p>
          <p className="text-sm text-gray-500">{p.domain} — Team of {p.teamSize}</p>
          <p className="text-sm mt-1">Status: {p.status}</p>
          <button
            onClick={() => navigate(`/applicants/${p._id}`)}
            className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            View Applicants
          </button>
        </div>
      ))}
    </div>
  )
}