const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: "category"
  },
  ancestors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "category"
    }
  ],
  description: [[String, String]],
  metaDescription: [[String, String]],
  tags: [String]
});
const Category = mongoose.model("category", categorySchema);
module.exports = Category;
