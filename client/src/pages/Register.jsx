import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../features/auth/authSlice'
import authService from '../services/authService'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await authService.register(form)
      dispatch(setUser(data))
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" value={form.name}
            onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" required />
          <input name="email" type="email" placeholder="Email" value={form.email}
            onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" required />
          <input name="password" type="password" placeholder="Password" value={form.password}
            onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" required />
          <select name="role" value={form.role}
            onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
            <option value="student">Student</option>
            <option value="supervisor">Supervisor</option>
          </select>
          <button type="submit"
            className="w-full rounded-md px-4 py-2 bg-blue-700 text-white hover:bg-blue-800">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  )
}