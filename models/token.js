const crypto = require("crypto");
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 10800 },
  type: { type: String, required: true },
  extraData: String
});
tokenSchema.statics.generateToken = function(length = 2) {
  return crypto.randomBytes(length).toString("hex");
};
tokenSchema.statics.hashToken = function(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

const TokenModel = mongoose.model("token", tokenSchema);
exports.Token = TokenModel;
