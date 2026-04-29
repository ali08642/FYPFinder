
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import projectService from '../services/projectService'

import profileService from '../services/profileService'

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth)
  const [data, setData] = useState([])

  const [recommendations, setRecommendations] = useState([])
  const [loadingRec, setLoadingRec] = useState(false)
  const [recMessage, setRecMessage] = useState('')

  useEffect(() => {
    if (user?.role === 'student') {
      projectService.getMyApplications().then(setData)
    } else if (user?.role === 'supervisor') {
      projectService.getMyProjects().then(setData)
    }
  }, [user])

  const statusColor = (status) => {
    if (status === 'approved') return 'text-green-600'
    if (status === 'rejected') return 'text-red-600'
    if (status === 'under_review') return 'text-amber-600'
    return 'text-gray-500'
  }
  const handleGetRecommendations = async () => {
    setLoadingRec(true)
    setRecMessage('')
    try {
        const recs = await profileService.getRecommendations()
        setRecommendations(recs)
        if (!recs || recs.length === 0) {
          setRecMessage('No open projects available for recommendations.')
        }
    } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Could not get recommendations'
        alert(message)
    }
    setLoadingRec(false)
    }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>

      {user?.role === 'student' && (
        <div>
          <h2 className="text-lg font-semibold mb-3">My Applications</h2>
          {data.length === 0 && <p className="text-gray-500">No applications yet.</p>}
          {data.map((app) => (
            <div key={app._id} className="border p-4 rounded bg-white mb-3">
              <p className="font-medium">{app.project?.title}</p>
              <p className="text-sm text-gray-500">{app.project?.domain}</p>
              <p className={`text-sm font-semibold mt-1 ${statusColor(app.status)}`}>
                {app.status}
              </p>
            </div>
          ))}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">AI Project Recommendations</h2>
            <button
                onClick={handleGetRecommendations}
                className="mb-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
                {loadingRec ? 'Getting recommendations...' : 'Get AI Recommendations'}
            </button>
            {recMessage && <p className="text-sm text-gray-600 mb-3">{recMessage}</p>}
            {recommendations.map((rec, i) => (
                <div key={i} className="border p-4 rounded bg-purple-50 mb-3">
                <p className="font-semibold">{rec.title}</p>
                <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                </div>
            ))}
            </div>
        </div>
      )}

      {user?.role === 'supervisor' && (
        <div>
          <h2 className="text-lg font-semibold mb-3">My Posted Projects</h2>
          {data.length === 0 && <p className="text-gray-500">No projects posted yet.</p>}
          {data.map((p) => (
            <div key={p._id} className="border p-4 rounded bg-white mb-3">
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-gray-500">{p.domain} — Team of {p.teamSize}</p>
              <p className="text-sm mt-1">Status: <span className="font-medium">{p.status}</span></p>
            </div>
          ))}
        </div>
      )}

      {user?.role === 'admin' && (
        <p className="text-gray-600">Admin panel coming up in the next phase.</p>
      )}
    </div>
  )
}