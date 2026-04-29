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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Projects</h1>
      {projects.length === 0 && <p className="text-gray-500 text-center">No projects posted yet</p>}
      {projects.map((p) => (
        <div key={p._id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition mb-3">
          <p className="font-medium">{p.title}</p>
          <p className="text-sm text-gray-500">{p.domain} — Team of {p.teamSize}</p>
          <p className="text-sm mt-1">Status: {p.status}</p>
          <button
            onClick={() => navigate(`/applicants/${p._id}`)}
            className="mt-3 rounded-md px-4 py-2 bg-blue-700 text-white hover:bg-blue-800"
          >
            View Applicants
          </button>
        </div>
      ))}
    </div>
  )
}