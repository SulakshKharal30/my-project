const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  timestamp: { type: Date, default: () => new Date() },
  type: { type: String, required: true },
  user: String,
  correlationId: String,
  payload: mongoose.Schema.Types.Mixed,
  outcome: mongoose.Schema.Types.Mixed,
  immutable: { type: Boolean, default: true }
}, { versionKey: false });

module.exports = mongoose.model('AuditLog', AuditSchema);

// helper create function
module.exports.create = async function(data) {
  const doc = new AuditLog(data);
  return doc.save();
}
