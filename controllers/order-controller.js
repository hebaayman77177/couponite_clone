const { Order } = require("../models/order");
const { idExist } = require("../validationSchemas");

async function createOrder(req, res, next) {
  //create the order
  const order = await Order.create(req.body);
  return res.status(200).json({
    message: "the order has been created successfully",
    data: { order }
  });
}
async function getOrders(req, res, next) {
  const orders = await Order.find();
  return res.status(200).json({
    length: orders.length,
    orders
  });
}
async function getOrder(req, res, next) {
  const order = await Order.findById(req.params.id);
  return res.status(200).json({
    order
  });
}
async function deleteOrder(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Order);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const order = await Order.findByIdAndRemove(id);
  return res.status(200).json({
    order
  });
}
async function updateOrder(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Order);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const order = await Order.findByIdAndUpdate(id, req.body, {
    new: true
  });
  return res.status(200).json({
    order
  });
}

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  getOrder
};
