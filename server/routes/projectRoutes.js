const express = require('express')
const router = express.Router()
const { getProjects, getProjectById, createProject, updateProject, deleteProject, getMyProjects } = require('../controllers/projectController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getProjects)
router.get('/mine', protect, getMyProjects)
router.get('/:id', getProjectById)
router.post('/', protect, createProject)
router.put('/:id', protect, updateProject)
router.delete('/:id', protect, deleteProject)

module.exports = router