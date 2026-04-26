import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import projectService from '../services/projectService'

export default function Applicants() {
  const { projectId } = useParams()
  const [applicants, setApplicants] = useState([])

  useEffect(() => {
    projectService.getApplicants(projectId).then(setApplicants)
  }, [projectId])

  const handleStatus = async (appId, status) => {
    try {
      await projectService.updateStatus(appId, status)
      setApplicants(applicants.map(a =>
        a._id === appId ? { ...a, status } : a
      ))
    } catch (err) {
      alert('Failed to update status')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Applicants</h1>
      {applicants.length === 0 && <p className="text-gray-500">No applicants yet.</p>}
      {applicants.map((app) => (
        <div key={app._id} className="border p-4 rounded bg-white mb-3">
          <p className="font-medium">{app.student?.name}</p>
          <p className="text-sm text-gray-500">{app.student?.email}</p>
          <p className="text-sm mt-1">Status: <span className="font-medium">{app.status}</span></p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleStatus(app._id, 'approved')}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Approve
            </button>
            <button onClick={() => handleStatus(app._id, 'rejected')}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
              Reject
            </button>
            <button onClick={() => handleStatus(app._id, 'under_review')}
              className="text-sm bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600">
              Under Review
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}