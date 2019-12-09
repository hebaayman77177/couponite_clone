const router = require("express").Router();
const orderController = require("../controllers/order-controller");
const validate = require("../middlewares/validation-middleware");
const validationSchemas = require("../validationSchemas");

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  orderController.getOrder
);
router.patch(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  orderController.updateOrder
);
router.delete(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  orderController.deleteOrder
);
module.exports = router;
