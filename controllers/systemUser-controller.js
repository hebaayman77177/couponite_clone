const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const config = require("config");
const sendEmail = require("../utils/mail");
const SystemUser = require("../models/systemUser");
const { Token } = require("../models/token");
// const { Token } = require("../models/token");

async function create(req, res, next) {
  const { email, password, role, phone } = req.body;
  let user;
  if (email) {
    user = await SystemUser.findOne({ email });
  }
  if (phone) {
    user = await SystemUser.findOne({ phone });
  }
  // Make sure user doesn't already exist
  if (user) {
    return res.status(400).json({
      message:
        "The email or phone you have entered is already associated with another account."
    });
  }
  user = new SystemUser({ email, role, phone });
  await user.setPassword(password);
  await user.save();

  return res.status(200).json({
    message: "the user has been created successfully",
    data: { email: user.email, role: user.role }
  });
}
async function getUsers(req, res, next) {
  const users = await SystemUser.find().select("-password");
  return res.status(200).json({
    length: users.length,
    users
  });
}
async function getUser(req, res, next) {
  const user = await SystemUser.findById(req.params.id).select("-password");
  return res.status(200).json({
    user
  });
}
async function deleteUser(req, res, next) {
  //TODO: see the diff between remove and delete
  const user = await SystemUser.findByIdAndRemove(req.params.id);
  return res.status(200).json({
    user
  });
}
async function updateUser(req, res, next) {
  //TODO: see the diff between remove and delete
  const user = await SystemUser.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  return res.status(200).json({
    user
  });
}

async function login(req, res, next) {
  //check the email and password exist
  const { loginField, password } = req.body;
  let { email, phone } = req.body;
  if (loginField) {
    const reg = new RegExp("^[0-9]+$");
    if (reg.test(loginField)) {
      phone = loginField;
    } else {
      email = loginField;
    }
  }
  if (!password) {
    return res.status(400).json({ message: "some info are invalid" });
  }
  if (!email) {
    if (!phone) {
      return res.status(400).json({ message: "some info are invalid" });
    }
  }
  //check if there is a user with  correct password
  let user;
  if (email) {
    user = await SystemUser.findOne({ email: email });
    // eslint-disable-next-line no-else-return
  } else if (phone) {
    user = await SystemUser.findOne({ phone: phone });
  }
  if (!user || !(await user.verifyPassword(password))) {
    return res.status(400).json({ message: "some info are invalid" });
  }
  return res.status(200).json({
    token: user.generateToken()
  });
}

async function resendToken(req, res, next) {
  //TODO:validate that the type exist as if not it will through the error from mongoose
  const { type, email, phone } = req.body;

  const user = await SystemUser.findOne({
    $or: [{ email }, { phone }]
  });
  if (!user)
    return res
      .status(400)
      .json({ message: "We were unable to find a user with this info." });
  const resetToken = crypto.randomBytes(32).toString("hex");
  const token = new Token({
    _userId: user._id,
    token: crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex"),
    type
  });
  // Save the verification token
  await token.save();

  //depending on you want to send it via email or phone add the following code in if condition
  const mailOptions = {
    email: user.email,
    subject: "Account Verification Token",
    message: resetToken
  };
  await sendEmail(mailOptions);

  return res.status(200).send({
    message: `A verification email has been sent to ${user.email} .`
  });
}

async function forgotPassword(req, res, next) {
  //get the user
  const user = await SystemUser.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .send({ message: "there is no user with this email" });
  }
  //get the token
  const resetToken = Token.generateToken(16);
  const token = new Token({
    _userId: user._id,
    token: crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex"),
    type: "password",
    extraData: await bcrypt.hash(
      req.body.password,
      config.get("bcrypt.saltRounds")
    )
  });
  await token.save();
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/resetPassword/${resetToken}`;
  //send the token to the email of the user
  const options = {
    email: user.email,
    subject: "token to reset your password",
    message: `please go to this url:${resetUrl} to reset your password`
  };
  await sendEmail(options);

  return res.status(200).json({
    message: "Token sent to email!"
  });
}

async function resetPassword(req, res, next) {
  //get the user of the token
  let token = Token.hashToken(req.params.token);
  token = await Token.findOne({ token, type: "password" });
  if (!token)
    return res.status(400).send({
      message:
        "We were unable to find a valid token. Your token my have expired."
    });

  const user = await SystemUser.findOne({
    _id: token._userId
  });
  if (!user)
    return res
      .status(400)
      .json({ message: "We were unable to find a user for this token." });

  await SystemUser.findByIdAndUpdate(token._userId, {
    password: token.extraData
  });
  await Token.findOneAndDelete({ _id: token._id });

  return res.status(200).json({
    status: "success",
    message: "the password has been successfully changed"
  });
}

module.exports = {
  create,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  login,
  resendToken,
  forgotPassword,
  resetPassword
};
