const SystemUser = require("../models/systemUser");
const {
  createAndSendToken,
  changePassword,
  loginUser
} = require("../utils/user");
const { idExist } = require("../validationSchemas");

async function create(req, res, next) {
  const { name, email, password, role, phone } = req.body;
  let user;
  user = await SystemUser.findOne({ email });
  if (user) {
    return res.status(400).json({
      message:
        "The email you have entered is already associated with another account."
    });
  }
  user = await SystemUser.findOne({ phone });
  // Make sure user doesn't already exist
  if (user) {
    return res.status(400).json({
      message:
        "The phone you have entered is already associated with another account."
    });
  }
  user = new SystemUser({ name, email, role, phone });
  await user.setPassword(password);
  await user.save();

  return res.status(200).json({
    message: "the user has been created successfully",
    data: { name: user.name, email: user.email, role: user.role }
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
  const { id } = req.params;
  const exist = await idExist(id, SystemUser);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const user = await SystemUser.findByIdAndRemove(id);
  return res.status(200).json({
    user
  });
}
async function updateUser(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, SystemUser);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const user = await SystemUser.findByIdAndUpdate(id, req.body, {
    new: true
  });
  return res.status(200).json({
    user
  });
}
async function login(req, res, next) {
  const { loginField, password, email, phone } = req.body;
  const options = { loginField, password, email, phone, Model: SystemUser };
  const user = await loginUser(options);
  if (!user) {
    return res.status(400).json({ message: "some info are invalid" });
  }
  return res.status(200).json({
    token: user.generateToken()
  });
}
//resend the token by the email or phone of the user to the user mail
async function resendToken(req, res, next) {
  const { email, phone, password } = req.body;
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/systemUsers/resetPassword/`;
  const user = new SystemUser();
  await user.setPassword(password);
  const sent = await createAndSendToken({
    type: "password",
    email,
    phone,
    Model: SystemUser,
    tokenLength: 16,
    sendBy: "mail",
    resetUrl,
    extraData: user.password
  });
  if (sent) {
    return res.status(200).json({
      message: `A verification email has been sent .`
    });
  }
  return res.status(400).json({
    message: "there is no user with this info"
  });
}
async function resetPassword(req, res, next) {
  //get the user of the token
  const resetToken = req.params.token;
  const reseted = await changePassword({ resetToken, Model: SystemUser });
  if (reseted) {
    return res.status(200).json({
      message: "the password has been successfully changed"
    });
  }
  return res.status(400).json({
    message: "We were unable to find a valid token. Your token my have expired."
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
  resetPassword
};
