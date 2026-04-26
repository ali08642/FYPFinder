import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'

export default function Navbar() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <span className="font-bold text-lg cursor-pointer" onClick={() => navigate('/dashboard')}>
        FYPFinder
      </span>
      {user && (
        <div className="flex items-center gap-4 text-sm">
          <span>{user.name} ({user.role})</span>
          <button onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}