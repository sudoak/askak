let mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
  message: String,
  id: String,
  userId: String,
  date_time: Date
});

module.exports = mongoose.model("message", messageSchema);
