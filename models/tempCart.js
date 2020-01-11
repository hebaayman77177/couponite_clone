const mongoose = require("mongoose");
const Fawn = require("fawn");

const tempCartSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  user: mongoose.Schema.ObjectId,
  cart: [
    {
      deal_id: mongoose.Schema.ObjectId,
      item_id: mongoose.Schema.ObjectId,
      quantity: Number,
      itemPrice: Number
    }
  ]
});

tempCartSchema.pre("save", { document: true }, async function() {
  setTimeout(async () => {
    const _id = this._id;
    const tempCart = await this.constructor.findById(_id);
    console.log(tempCart);
    if (tempCart) {
      const task = Fawn.Task();
      // eslint-disable-next-line no-restricted-syntax
      for (const order of tempCart.cart) {
        task.update(
          "Deal",
          {
            _id: order.deal_id,
            "item._id": order.item_id
          },
          { $inc: { "item.$.quantity": order.quantity } }
        );
      }
      await task.run({ useMongoose: true }).then(async () => {
        await this.constructor.findByIdAndDelete(_id);
      });
    }
  }, 90000 * 1000 * 1); //expires after 25 hours 90000
});
const TempCartModel = mongoose.model("tempCart", tempCartSchema);
exports.TempCart = TempCartModel;
