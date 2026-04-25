const express = require('express')
const router = express.Router()
const { applyToProject, getMyApplications, getApplicantsForProject, updateApplicationStatus } = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, applyToProject)
router.get('/mine', protect, getMyApplications)
router.get('/project/:projectId', protect, getApplicantsForProject)
router.put('/:id/status', protect, updateApplicationStatus)

module.exports = router