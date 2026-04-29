const express = require('express')
const router = express.Router()
const { getProfile, updateProfile, getAIRecommendations, generateAIBio } = require('../controllers/profileController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, getProfile)
router.put('/', protect, updateProfile)
router.post('/generate-bio', protect, generateAIBio)
router.get('/recommendations', protect, getAIRecommendations)

module.exports = router