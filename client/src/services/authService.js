import axios from 'axios'

const API = 'http://localhost:5000/api/auth'

const register = async (userData) => {
  const res = await axios.post(`${API}/register`, userData)
  return res.data
}

const login = async (userData) => {
  const res = await axios.post(`${API}/login`, userData)
  return res.data
}

export default { register, login }