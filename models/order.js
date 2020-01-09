const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  merchant: {
    name: String,
    id: mongoose.Schema.ObjectId
  },
  customer: mongoose.Schema.ObjectId,
  deal: mongoose.Schema.ObjectId,
  item: mongoose.Schema.ObjectId,

  quantity: Number,
  itemPrice: Number,
  //enum
  status: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  yallaDealzPersentage: Number,
  totalPrice: Number,
  yallDealzTotal: Number,
  merchantTotal: Number
});

orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });

orderSchema.pre("save", function(next) {
  this.totalPrice = this.quantity * this.itemPrice;
  this.yallDealzTotal =
    this.quantity * this.itemPrice * this.yallaDealzPersentage;
  this.merchantTotal =
    this.quantity * this.itemPrice -
    this.quantity * this.itemPrice * this.yallaDealzPersentage;
  next();
});
// orderSchema.virtual("totalPrice").get(function() {
//   return this.quantity * this.itemPrice;
// });
// orderSchema.virtual("yallDealzTotal").set(function() {
//   return this.quantity * this.itemPrice * this.yallaDealzPersentage;
// });
// orderSchema.virtual("merchantTotal").set(function() {
//   return (
//     this.quantity * this.itemPrice -
//     this.quantity * this.itemPrice * this.yallaDealzPersentage
//   );
// });

const Order = mongoose.model("order", orderSchema);

module.exports = { Order };
