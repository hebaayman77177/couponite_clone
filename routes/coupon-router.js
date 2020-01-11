const router = require("express").Router();
const couponController = require("../controllers/coupon-controller");
const validate = require("../middlewares/validation-middleware");
const validationSchemas = require("../validationSchemas");
const authanticate = require("../middlewares/autahnitcate-middleware");

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
router.post("/useCoupon",authanticate, couponController.useCoupon);
module.exports = router;
