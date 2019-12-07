const router = require("express").Router();
const categoryController = require("../controllers/category-controller");
const authanticate = require("../middlewares/autahnitcate-middleware");
const validate = require("../middlewares/validation-middleware");
const validationSchemas = require("../validationSchemas");
const { grantAccess } = require("../roles");

router.get("/", categoryController.getCategories);
router.post(
  "/",
  validate(validationSchemas.categoryPost, "body"),
  authanticate,
  grantAccess("createAny", "category"),
  categoryController.createCategory
);
router.get(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  categoryController.getCategory
);
router.patch(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  validate(validationSchemas.categoryUpdate, "body"),
  authanticate,
  grantAccess("updateAny", "category"),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  authanticate,
  grantAccess("deleteAny", "category"),
  categoryController.deleteCategory
);
module.exports = router;
