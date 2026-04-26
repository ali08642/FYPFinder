const express = require('express')
const router = express.Router()
const { getPosts, createPost, deletePost } = require('../controllers/blogController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/', getPosts)
router.post('/', protect, adminOnly, createPost)
router.delete('/:id', protect, adminOnly, deletePost)

module.exports = router