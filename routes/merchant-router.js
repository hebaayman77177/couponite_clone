const router = require("express").Router();
const merchantController = require("../controllers/merchant-controller");
const validate = require("../middlewares/validation-middleware");
const validationSchemas = require("../validationSchemas");

router.post("/", merchantController.create);
router.post(
  "/login",
  //   validate(validationSchemas.login, "body"),
  merchantController.login
);
router.get("/", merchantController.getMerchants);
router.get(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  merchantController.getMerchant
);
router.patch(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  merchantController.updateMerchant
);
router.delete(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  merchantController.deleteMerchant
);
router.post("/resendToken", merchantController.resendToken);
router.post("/forgotPassword", merchantController.resendToken);
router.get("/resetPassword/:token", merchantController.resetPassword);
module.exports = router;
