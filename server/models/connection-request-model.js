const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "Counselor", required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected", "Withdrawn"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);