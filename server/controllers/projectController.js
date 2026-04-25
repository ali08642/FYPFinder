const Project = require('../models/Project')

// api to browse projects 
//get api/projects
const getProjects = async (req, res) => {
  const projects = await Project.find({ status: 'open' }).populate('supervisor', 'name email')
  res.json(projects)
}

// GET /api/projects/:id — single project
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('supervisor', 'name email')
  if (!project) return res.status(404).json({ message: 'Project not found' })
  res.json(project)
}

// POST /api/projects — supervisor only
const createProject = async (req, res) => {
  const { title, description, domain, teamSize } = req.body

  const project = await Project.create({
    title,
    description,
    domain,
    teamSize,
    supervisor: req.user._id
  })

  res.status(201).json(project)
}

// PUT /api/projects/:id — supervisor only, their own project
const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) return res.status(404).json({ message: 'Project not found' })

  if (project.supervisor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your project' })
  }

  const { title, description, domain, teamSize, status } = req.body
  project.title = title || project.title
  project.description = description || project.description
  project.domain = domain || project.domain
  project.teamSize = teamSize || project.teamSize
  project.status = status || project.status

  const updated = await project.save()
  res.json(updated)
}

// DELETE /api/projects/:id — supervisor only
const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) return res.status(404).json({ message: 'Project not found' })

  if (project.supervisor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your project' })
  }

  await project.deleteOne()
  res.json({ message: 'Project deleted' })
}

// GET /api/projects/mine — supervisor sees their own projects
const getMyProjects = async (req, res) => {
  const projects = await Project.find({ supervisor: req.user._id })
  res.json(projects)
}

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject, getMyProjects }