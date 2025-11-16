const mongoose = require("mongoose");
const complaintSchema = require("../Schemas/ComplaintSchema");

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;