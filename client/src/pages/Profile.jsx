import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import profileService from '../services/profileService'

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const fileRef = useRef(null)

  const [form, setForm] = useState({ skills: '', interests: '', preferredDomain: 'any', github: '', bio: '', photo: '' })
  const [saved, setSaved] = useState(false)
  const [bioLoading, setBioLoading] = useState(false)

  useEffect(() => {
    profileService.getProfile().then(data => {
      setForm({
        skills: data.skills || '',
        interests: data.interests || '',
        preferredDomain: data.preferredDomain || 'any',
        github: data.github || '',
        bio: data.bio || '',
        photo: data.photo || ''
      })
    })
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((prev) => ({ ...prev, photo: String(reader.result || '') }))
    reader.readAsDataURL(file)
  }

  const handleGenerateBio = async () => {
    setBioLoading(true)
    try {
      const res = await profileService.generateBio({
        name: user?.name,
        skills: form.skills,
        interests: form.interests,
        preferredDomain: form.preferredDomain,
        github: form.github,
      })
      setForm((prev) => ({ ...prev, bio: res.bio || '' }))
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to generate bio')
    }
    setBioLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await profileService.updateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition"
          title="Upload photo"
        >
          {form.photo ? (
            <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm text-gray-600">Upload</span>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="skills" placeholder="Skills (e.g. Python, React, ML)"
          value={form.skills} onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
        <input name="interests" placeholder="Interests (e.g. NLP, Computer Vision)"
          value={form.interests} onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
        <select name="preferredDomain" value={form.preferredDomain}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
          <option value="any">Any Domain</option>
          <option value="AI">AI</option>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="Cybersecurity">Cybersecurity</option>
        </select>
        <input name="github" placeholder="GitHub URL"
          value={form.github} onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <button
              type="button"
              onClick={handleGenerateBio}
              disabled={bioLoading}
              className="rounded-md px-4 py-2 bg-purple-600 text-white hover:bg-purple-700"
            >
              {bioLoading ? 'Generating...' : 'Generate Bio with AI'}
            </button>
          </div>
          <textarea name="bio" placeholder="Short bio"
            value={form.bio} onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" rows={4} />
        </div>

        <button type="submit" className="w-full rounded-md px-4 py-2 bg-blue-700 text-white hover:bg-blue-800">
          Save Profile
        </button>
        {saved && <p className="text-green-600 text-sm text-center">Saved!</p>}
      </form>
    </div>
  )
}