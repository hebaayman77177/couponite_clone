const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: "category"
  },
  ancestors: [
    {
      name: String,
      slug: [String],
      parent: mongoose.Schema.ObjectId
    }
  ],
  // ex:[["en","english description"],["arabic","arabic description"]]
  description: [[String, String]],
  metaDescription: [[String, String]],
  tags: [String]
});
const Category = mongoose.model("category", categorySchema);
module.exports = { Category, categorySchema };
