const router = require("express").Router();
const userController = require("../controllers/user-controller");
const authanticate = require("../middlewares/autahnitcate-middleware");

const passport = require("passport");

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/facebook/callback"
  }),
  function(req, res) {
    return res.status(200).json({ data: req.user });
  }
);

router.post("/add", userController.create);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/confirmToken", userController.confirmToken);
router.post("/resendToken", userController.resendToken);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.post("/changePhone", authanticate, userController.changePhone);
router.post("/resetPhone", authanticate, userController.resetPhone);
module.exports = router;
