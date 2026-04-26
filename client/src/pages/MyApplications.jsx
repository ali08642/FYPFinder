import { useEffect, useState } from 'react'
import projectService from '../services/projectService'

export default function MyApplications() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    projectService.getMyApplications().then(setApplications)
  }, [])

  const statusColor = (status) => {
    if (status === 'approved') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    if (status === 'under_review') return 'bg-amber-100 text-amber-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      {applications.length === 0 && <p className="text-gray-500">You haven't applied to any projects yet.</p>}
      {applications.map((app) => (
        <div key={app._id} className="border p-4 rounded bg-white mb-3">
          <p className="font-medium">{app.project?.title}</p>
          <p className="text-sm text-gray-500 mb-2">{app.project?.domain}</p>
          <span className={`text-xs px-2 py-1 rounded font-semibold ${statusColor(app.status)}`}>
            {app.status}
          </span>
        </div>
      ))}
    </div>
  )
}