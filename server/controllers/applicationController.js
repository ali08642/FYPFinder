const Application = require('../models/Application')
const Project = require('../models/Project')

// POST /api/applications — student applies
const applyToProject = async (req, res) => {
  const { projectId, message } = req.body

  const already = await Application.findOne({
    project: projectId,
    student: req.user._id
  })
  if (already) return res.status(400).json({ message: 'Already applied' })

  const application = await Application.create({
    project: projectId,
    student: req.user._id,
    message
  })

  res.status(201).json(application)
}

// GET /api/applications/mine — student sees their applications
const getMyApplications = async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .populate('project', 'title domain supervisor')
  res.json(applications)
}

// GET /api/applications/project/:projectId — supervisor sees applicants
const getApplicantsForProject = async (req, res) => {
  const project = await Project.findById(req.params.projectId)
  if (!project) return res.status(404).json({ message: 'Project not found' })

  if (project.supervisor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your project' })
  }

  const applications = await Application.find({ project: req.params.projectId })
    .populate('student', 'name email')
  res.json(applications)
}

// PUT /api/applications/:id/status — supervisor updates status
const updateApplicationStatus = async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('project')

  if (!application) return res.status(404).json({ message: 'Application not found' })

  if (application.project.supervisor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  application.status = req.body.status
  const updated = await application.save()
  res.json(updated)
}

module.exports = { applyToProject, getMyApplications, getApplicantsForProject, updateApplicationStatus }