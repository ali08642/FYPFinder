import axios from 'axios'

const API = 'http://localhost:5000/api/profile'

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return { headers: { Authorization: `Bearer ${user?.token}` } }
}

const getProfile = async () => {
  const res = await axios.get(API, getAuthHeader())
  return res.data
}

const updateProfile = async (data) => {
  const res = await axios.put(API, data, getAuthHeader())
  return res.data
}

const getRecommendations = async () => {
  const res = await axios.get(`${API}/recommendations`, getAuthHeader())
  return res.data
}

export default { getProfile, updateProfile, getRecommendations }