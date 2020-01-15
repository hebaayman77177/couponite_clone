const router = require("express").Router();
const dealController = require("../controllers/deal-controller");
const validate = require("../middlewares/validation-middleware");
const validationSchemas = require("../validationSchemas");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/",
  // validate(validationSchemas.dealPost, "body"),
  upload.array("itemsImages"),
  dealController.createDeal
);
router.get("/", dealController.getDeals);
router.get(
  "/customerDeals",
  dealController.secureSearchMiddleware,
  dealController.customersSearchMiddleware,
  dealController.getDeals
);
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

router.route(":id/items").post();

router.route(":id/items/itemId").put().delete();
module.exports = router;
