const router = require("express").Router();
const systemUserController = require("../controllers/systemUser-controller");
const authanticate = require("../middlewares/autahnitcate-middleware");

const { roles, grantAccess } = require("../roles");
router.get(
  "/",
  authanticate,
  grantAccess("readAny", "systemUser"),
  systemUserController.getUsers
);
router.post("/", systemUserController.create);
router.get(
  "/:id",
  authanticate,
  grantAccess("readOwn", "systemUser"),
  systemUserController.getUser
);
router.patch(
  "/:id",
  authanticate,
  grantAccess("updateAny", "systemUser"),
  systemUserController.updateUser
);
router.delete(
  "/:id",
  authanticate,
  grantAccess("deleteAny", "systemUser"),
  systemUserController.deleteUser
);
router.post("/login", systemUserController.login);
module.exports = router;
