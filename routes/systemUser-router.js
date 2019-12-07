const router = require("express").Router();
const systemUserController = require("../controllers/systemUser-controller");
const authanticate = require("../middlewares/autahnitcate-middleware");
const validate = require("../middlewares/validation-middleware");
const validationSchemas = require("../validationSchemas");
const { grantAccess } = require("../roles");

router.get(
  "/",
  authanticate,
  grantAccess("readAny", "systemUser"),
  systemUserController.getUsers
);
router.post(
  "/",
  validate(validationSchemas.systemUserPost, "body"),
  authanticate,
  grantAccess("createAny", "systemUser"),
  systemUserController.create
);
router.get(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  authanticate,
  grantAccess("readOwn", "systemUser"),
  systemUserController.getUser
);
router.patch(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  validate(validationSchemas.systemUserUpdate, "body"),
  authanticate,
  grantAccess("updateAny", "systemUser"),
  systemUserController.updateUser
);
router.delete(
  "/:id",
  validate(validationSchemas.mongoId, "params"),
  authanticate,
  grantAccess("deleteAny", "systemUser"),
  systemUserController.deleteUser
);
router.post(
  "/login",
  validate(validationSchemas.login, "body"),
  systemUserController.login
);
router.post(
  "/resendToken",
  validate(validationSchemas.systemUserResetToken, "body"),
  systemUserController.resendToken
);
router.post(
  "/forgotPassword",
  validate(validationSchemas.systemUserResetToken, "body"),
  systemUserController.resendToken
);
router.get("/resetPassword/:token", systemUserController.resetPassword);
module.exports = router;
