const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    enum: ['AI', 'Web', 'Mobile', 'Cybersecurity', 'R&D', 'Other'],
    default: 'Other'
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamSize: {
    type: Number,
    default: 2
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)