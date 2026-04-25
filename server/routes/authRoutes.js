const express = require('express')
const router = express.Router()
const { regUser, loginUser } = require('../controllers/authController')

router.post('/register', regUser)
router.post('/login', loginUser)

module.exports = router