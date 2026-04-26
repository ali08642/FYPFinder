import { useEffect, useState } from 'react'
import profileService from '../services/profileService'

export default function Profile() {
  const [form, setForm] = useState({ skills: '', interests: '', preferredDomain: 'any', github: '', bio: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    profileService.getProfile().then(data => {
      setForm({
        skills: data.skills || '',
        interests: data.interests || '',
        preferredDomain: data.preferredDomain || 'any',
        github: data.github || '',
        bio: data.bio || ''
      })
    })
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await profileService.updateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="skills" placeholder="Skills (e.g. Python, React, ML)"
          value={form.skills} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="interests" placeholder="Interests (e.g. NLP, Computer Vision)"
          value={form.interests} onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="preferredDomain" value={form.preferredDomain}
          onChange={handleChange} className="w-full border p-2 rounded">
          <option value="any">Any Domain</option>
          <option value="AI">AI</option>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="Cybersecurity">Cybersecurity</option>
        </select>
        <input name="github" placeholder="GitHub URL"
          value={form.github} onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="bio" placeholder="Short bio"
          value={form.bio} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Save Profile
        </button>
        {saved && <p className="text-green-600 text-sm text-center">Profile saved!</p>}
      </form>
    </div>
  )
}