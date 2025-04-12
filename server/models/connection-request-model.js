const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "Counselor", required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected", "Withdrawn"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

// Add unique index to prevent duplicate client-counselor pairs
connectionRequestSchema.index({ clientId: 1, counselorId: 1 }, { unique: true });

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);