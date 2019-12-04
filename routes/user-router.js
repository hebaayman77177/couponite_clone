const router = require("express").Router();
const userController = require("../controllers/user-controller");
const googleUtils = require('../utils/login-with-google');

router.post("/add", userController.create);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/confirmToken", userController.confirmToken);
router.post("/resendToken", userController.resendToken);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.post("/changePhone", userController.changePhone);
router.post("/resetPhone", userController.resetPhone);

router.get('/auth/google', googleUtils.authenticateWithGoogle);
router.get('/auth/google/callback', googleUtils.googleCallBack);
module.exports = router;
