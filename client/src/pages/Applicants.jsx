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
      alert(err?.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Applicants</h1>
      {applicants.length === 0 && <p className="text-gray-500 text-center">No applicants yet</p>}
      {applicants.map((app) => (
        <div key={app._id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition mb-3">
          <p className="font-medium">{app.student?.name}</p>
          <p className="text-sm text-gray-500">{app.student?.email}</p>
          <div className="text-sm mt-2 flex items-center gap-2">
            <span className="text-gray-700">Status:</span>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              app.status === 'approved' ? 'bg-green-100 text-green-700' :
              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
              app.status === 'under_review' ? 'bg-amber-100 text-amber-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {app.status}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleStatus(app._id, 'approved')}
              className="rounded-md px-4 py-2 bg-green-600 text-white hover:bg-green-700">
              Approve
            </button>
            <button onClick={() => handleStatus(app._id, 'rejected')}
              className="rounded-md px-4 py-2 bg-red-600 text-white hover:bg-red-700">
              Reject
            </button>
            <button onClick={() => handleStatus(app._id, 'under_review')}
              className="rounded-md px-4 py-2 bg-amber-500 text-white hover:bg-amber-600">
              Under Review
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}