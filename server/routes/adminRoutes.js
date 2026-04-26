const express = require('express')
const router = express.Router()
const { getAnalytics, getCashFlow, addCashFlow } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/analytics', protect, adminOnly, getAnalytics)
router.get('/cashflow', protect, adminOnly, getCashFlow)
router.post('/cashflow', protect, adminOnly, addCashFlow)

module.exports = router