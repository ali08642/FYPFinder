import { useState } from 'react'
import projectService from '../services/projectService'

export default function PostProject() {
  const [form, setForm] = useState({ title: '', description: '', domain: 'Web', teamSize: 2 })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await projectService.createProject(form)
      alert('Project posted!')
      setForm({ title: '', description: '', domain: 'Web', teamSize: 2 })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post project')
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Post a Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" value={form.title}
          onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" value={form.description}
          onChange={handleChange} className="w-full border p-2 rounded" rows={4} required />
        <select name="domain" value={form.domain}
          onChange={handleChange} className="w-full border p-2 rounded">
          <option>AI</option>
          <option>Web</option>
          <option>Mobile</option>
          <option>Cybersecurity</option>
          <option>Other</option>
        </select>
        <input name="teamSize" type="number" placeholder="Team Size" value={form.teamSize}
          onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Post Project
        </button>
      </form>
    </div>
  )
}