const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user-controller");
const authanticate = require("../middlewares/autahnitcate-middleware");
const { User } = require("../models/user");
// const googleUtils = require("../utils/login-with-google");

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
router.get("/resetPassword/:token", userController.resetPassword);
router.post("/changePhone", authanticate, userController.changePhone);
router.post("/resetPhone", authanticate, userController.resetPhone);


// owner functionality
router.get("/myInfo", userController.getMyInfo);
router.put("/myInfo", userController.editMyInfo);
router.put("/myPassword", userController.changeMyPasword);

// router.get("/auth/google", googleUtils.authenticateWithGoogle);
// router.get("/auth/google/callback", googleUtils.googleCallBack);
module.exports = router;
