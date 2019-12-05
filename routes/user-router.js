const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user-controller");
<<<<<<< HEAD
const authanticate = require("../middlewares/autahnitcate-middleware");
const { User } = require("../models/user");
||||||| eb01060
const authanticate = require("../middlewares/autahnitcate-middleware");

const passport = require("passport");
=======
const googleUtils = require('../utils/login-with-google');

const passport = require("passport");
>>>>>>> 42ebddc03887338c058f77f9a96faa1ea0194f7f

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/facebook"
  }),
  async function(req, res) {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ token: user.generateToken() });
  }
);

router.post("/add", userController.create);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/confirmToken", userController.confirmToken);
router.post("/resendToken", userController.resendToken);
router.post("/forgotPassword", userController.forgotPassword);
<<<<<<< HEAD
router.get("/resetPassword/:token", userController.resetPassword);
router.post("/changePhone", authanticate, userController.changePhone);
router.post("/resetPhone", authanticate, userController.resetPhone);
||||||| eb01060
router.post("/resetPassword", userController.resetPassword);
router.post("/changePhone", authanticate, userController.changePhone);
router.post("/resetPhone", authanticate, userController.resetPhone);
=======
router.post("/resetPassword", userController.resetPassword);
router.post("/changePhone", userController.changePhone);
router.post("/resetPhone", userController.resetPhone);

// owner functionality
router.get("/myInfo", userController.getMyInfo);
router.put("/myInfo", userController.editMyInfo);
touter.put("/myPassword", userController.changeMyPasword);

router.get('/auth/google', googleUtils.authenticateWithGoogle);
router.get('/auth/google/callback', googleUtils.googleCallBack);
>>>>>>> 42ebddc03887338c058f77f9a96faa1ea0194f7f
module.exports = router;
