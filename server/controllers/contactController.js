const Contact = require('../models/Contact')

// POST /api/contact
const submitContact = async (req, res) => {
  const { name, email, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'name, email, and message are required' })
  }

  const saved = await Contact.create({ name, email, message })
  res.status(201).json({ message: 'Submitted', id: saved._id })
}

module.exports = { submitContact }
