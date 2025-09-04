const postModel = require("../models/post.model");
const genrateCaption = require("../service/ai.service");

async function createPostController(req, res) {
  const file = req.file;

  console.log("File Recived:", file);

  const base64Image = Buffer.from(file.buffer).toString("base64");

  const caption = await genrateCaption(base64Image);
  console.log("Genrated Caption :", caption);
}

module.exports = {
  createPostController,
};
