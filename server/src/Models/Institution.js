const mongoose = require("mongoose");
const institutionSchema = require("../Schemas/InstitutionSchema");

const Institution = mongoose.model("Institution", institutionSchema);
module.exports = Institution;