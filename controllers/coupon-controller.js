const { Coupon } = require("../models/coupon");
const { idExist } = require("../validationSchemas");

async function createCoupon(req, res, next) {
  const coupon = await Coupon.create(req.body);
  return res.status(200).json({
    message: "the Coupon has been created successfully",
    data: { coupon }
  });
}
async function getCoupons(req, res, next) {
  const coupons = await Coupon.find();
  return res.status(200).json({
    length: coupons.length,
    coupons
  });
}
async function getCoupon(req, res, next) {
  const coupon = await Coupon.findById(req.params.id);
  return res.status(200).json({
    coupon
  });
}
async function deleteCoupon(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Coupon);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const coupon = await Coupon.findByIdAndRemove(id);
  return res.status(200).json({
    coupon
  });
}
async function updateCoupon(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Coupon);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
    new: true
  });
  return res.status(200).json({
    coupon
  });
}

module.exports = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon
};
