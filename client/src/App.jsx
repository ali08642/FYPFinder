import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BrowseProjects from './pages/BrowseProjects'
import PostProject from './pages/PostProject'
import MyApplications from './pages/MyApplications'
import MyProjects from './pages/MyProjects'
import Applicants from './pages/Applicants'

function App() {
  const { user } = useSelector((state) => state.auth)

  const wrap = (component) => user
    ? <Layout>{component}</Layout>
    : <Navigate to="/login" />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={wrap(<Dashboard />)} />
        <Route path="/projects" element={wrap(<BrowseProjects />)} />
        <Route path="/post-project" element={wrap(<PostProject />)} />
        <Route path="/my-applications" element={wrap(<MyApplications />)} />
        <Route path="/my-projects" element={wrap(<MyProjects />)} />
        <Route path="/applicants/:projectId" element={wrap(<Applicants />)} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App