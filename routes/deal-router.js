const router = require("express").Router();
const dealController = require("../controllers/deal-controller");
const validate = require("../middlewares/validation-middleware");
const validationSchemas = require("../validationSchemas");

router.post(
  "/",
  validate(validationSchemas.dealPost, "body"),
  dealController.createDeal
);
router.get("/", dealController.getDeals);
router.get(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  dealController.getDeal
);
router.patch(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  dealController.updateDeal
);
router.delete(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  dealController.deleteDeal
);
module.exports = router;
