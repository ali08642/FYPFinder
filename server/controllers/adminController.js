const CashFlow = require('../models/CashFlow')
const User = require('../models/User')
const Project = require('../models/Project')
const Application = require('../models/Application')

const getAnalytics = async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalStudents = await User.countDocuments({ role: 'student' })
  const totalSupervisors = await User.countDocuments({ role: 'supervisor' })
  const totalProjects = await Project.countDocuments()
  const totalApplications = await Application.countDocuments()
  const approved = await Application.countDocuments({ status: 'approved' })

  res.json({
    totalUsers,
    totalStudents,
    totalSupervisors,
    totalProjects,
    totalApplications,
    approved
  })
}

// GET /api/admin/analytics/domains
const getDomainAnalytics = async (req, res) => {
  const grouped = await Project.aggregate([
    {
      $group: {
        _id: '$domain',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const result = grouped.reduce((acc, row) => {
    acc[row._id] = row.count
    return acc
  }, {})

  res.json(result)
}

const getCashFlow = async (req, res) => {
  const records = await CashFlow.find().sort({ createdAt: -1 })
  res.json(records)
}

const addCashFlow = async (req, res) => {
  const record = await CashFlow.create(req.body)
  res.status(201).json(record)
}

module.exports = { getAnalytics, getDomainAnalytics, getCashFlow, addCashFlow }