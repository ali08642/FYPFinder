import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import BrowseProjects from './pages/BrowseProjects'
import PostProject from './pages/PostProject'

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={user ? <BrowseProjects /> : <Navigate to="/login" />} />
        <Route path="/post-project" element={user?.role === 'supervisor' ? <PostProject /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <h1 className="p-8">Welcome {user.name}</h1> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App