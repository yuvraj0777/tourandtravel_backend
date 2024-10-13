const mongoose = require("mongoose");

mongoose.connect(`mongodb://127.0.0.1:27017/backend`);

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  posts: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "feed"
    },
],
});

module.exports = mongoose.model("user", userSchema);
