const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "feed",
    },
  ],
});

const DB =
  process.env.MONGO_URI ||
  `mongodb+srv://yuvrajsinghgaharwar38:singh%40777@cluster0.nrxq8.mongodb.net/tourAndTravel?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.error("Connection error: ", err);
  });

module.exports = mongoose.model("User", userSchema);
