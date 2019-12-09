const router = require("express").Router();
const couponController = require("../controllers/coupon-controller");
const validate = require("../middlewares/validation-middleware");
const validationSchemas = require("../validationSchemas");

router.post("/", couponController.createCoupon);
router.get("/", couponController.getCoupons);
router.get(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  couponController.getCoupon
);
router.patch(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  couponController.updateCoupon
);
router.delete(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  couponController.deleteCoupon
);
module.exports = router;
