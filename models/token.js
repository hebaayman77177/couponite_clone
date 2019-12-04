const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
  type: { type: String, required: true },
  extraData: String
});

const TokenModel = mongoose.model("token", tokenSchema);
exports.Token = TokenModel;
