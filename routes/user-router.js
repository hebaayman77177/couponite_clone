const router = require("express").Router();
const userController = require("../controllers/user-controller");

router.post("/add", userController.create);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/confirmToken", userController.confirmToken);
router.post("/resendToken", userController.resendToken);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);

module.exports = router;
