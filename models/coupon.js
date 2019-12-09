const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "user" },
  deal: { type: mongoose.Schema.ObjectId, ref: "deal" },
  data: String,
  status: {
    type: String,
    enum: ["active", "used", "expired"]
  }
});

const Coupon = mongoose.model("coupon", couponSchema);

module.exports = { Coupon };
