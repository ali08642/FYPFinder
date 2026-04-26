const mongoose = require('mongoose')

const cashFlowSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  month: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('CashFlow', cashFlowSchema)