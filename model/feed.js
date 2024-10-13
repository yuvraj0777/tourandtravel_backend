const mongoose = require("mongoose");

const feedSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: String,
});

module.exports = mongoose.model("feed", feedSchema);  