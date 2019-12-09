const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  merchant: {
    name: String,
    id: mongoose.Schema.ObjectId
  },
  customer: mongoose.Schema.ObjectId,
  deal: mongoose.Schema.ObjectId,
  quantity: Number,
  itemPrice: Number,
  //enum
  status: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  yallaDealzPersentage: Number
});

orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });

orderSchema.virtual("totalPrice").get(function() {
  return this.quantity * this.itemPrice;
});
orderSchema.virtual("yallDealzTotal").get(function() {
  return this.quantity * this.itemPrice * this.yallaDealzPersentage;
});
orderSchema.virtual("merchantTotal").get(function() {
  return (
    this.quantity * this.itemPrice -
    this.quantity * this.itemPrice * this.yallaDealzPersentage
  );
});

const Order = mongoose.model("order", orderSchema);

module.exports = { Order };
