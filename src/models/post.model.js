const mongoose = require("mongoose");

const postSchema = new mongooose.Schema({
  image: String,
  caption: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});
const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
