const User = require('../models/User')
const Project = require('../models/Project')
const { getRecommendations } = require('../services/aiService')

// GET /api/profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.json(user)
}

// PUT /api/profile
const updateProfile = async (req, res) => {
  const { skills, interests, preferredDomain, github, bio } = req.body
  const user = await User.findById(req.user._id)

  user.skills = skills || user.skills
  user.interests = interests || user.interests
  user.preferredDomain = preferredDomain || user.preferredDomain
  user.github = github || user.github
  user.bio = bio || user.bio

  const updated = await user.save()
  res.json(updated)
}

// GET /api/profile/recommendations
const getAIRecommendations = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-password')
    if (!student) {
      return res.status(404).json({ message: 'User not found' })
    }

    const projects = await Project.find({ status: 'open' }).limit(25)

    if (projects.length === 0) {
      return res.json([])
    }

    const recommendations = await getRecommendations(student, projects)
    return res.json(recommendations)
  } catch (err) {
    console.error('AI recommendations error:', err?.message || err)
    return res.status(502).json({
      message: 'AI recommendations failed. Check server configuration and try again.',
      error: err?.message || 'Unknown error',
    })
  }
}

module.exports = { getProfile, updateProfile, getAIRecommendations }