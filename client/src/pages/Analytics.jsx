import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return { headers: { Authorization: `Bearer ${user?.token}` } }
}

export default function Analytics() {
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [domains, setDomains] = useState({})

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/analytics', getAuthHeader())
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))

    axios.get('http://localhost:5000/api/admin/analytics/domains', getAuthHeader())
      .then((res) => setDomains(res.data))
      .catch(() => setDomains({}))
  }, [])

  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/dashboard" />

  const totalApplications = stats?.totalApplications || 0
  const approved = stats?.approved || 0
  const approvalRate = totalApplications === 0 ? 0 : Math.round((approved / totalApplications) * 100)

  const domainData = useMemo(() => {
    const ordered = ['AI', 'Web', 'Mobile', 'Cybersecurity', 'Other']
    return ordered.map((d) => ({
      domain: d,
      count: Number(domains?.[d] || 0)
    }))
  }, [domains])

  const roleData = useMemo(() => {
    const students = stats?.totalStudents || 0
    const supervisors = stats?.totalSupervisors || 0
    return [
      { name: 'Students', value: students },
      { name: 'Supervisors', value: supervisors },
    ]
  }, [stats])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <p className="text-3xl font-bold">{stats?.totalUsers ?? '—'}</p>
          <p className="text-gray-600">Total Users</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <p className="text-3xl font-bold">{stats?.totalProjects ?? '—'}</p>
          <p className="text-gray-600">Total Projects</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <p className="text-3xl font-bold">{stats?.totalApplications ?? '—'}</p>
          <p className="text-gray-600">Total Applications</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <p className="text-3xl font-bold">{approvalRate}%</p>
          <p className="text-gray-600">Approval Rate</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Projects by Domain</h2>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={domainData}>
              <XAxis dataKey="domain" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">User Split</h2>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" outerRadius={90} label>
                <Cell fill="#2563eb" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
