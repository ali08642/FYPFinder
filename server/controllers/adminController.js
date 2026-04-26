const CashFlow = require('../models/CashFlow')
const User = require('../models/User')
const Project = require('../models/Project')
const Application = require('../models/Application')

const getAnalytics = async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalProjects = await Project.countDocuments()
  const totalApplications = await Application.countDocuments()
  const approved = await Application.countDocuments({ status: 'approved' })

  res.json({ totalUsers, totalProjects, totalApplications, approved })
}

const getCashFlow = async (req, res) => {
  const records = await CashFlow.find().sort({ createdAt: -1 })
  res.json(records)
}

const addCashFlow = async (req, res) => {
  const record = await CashFlow.create(req.body)
  res.status(201).json(record)
}

module.exports = { getAnalytics, getCashFlow, addCashFlow }