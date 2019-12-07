const Merchant = require("../models/merchant");
const { idExist } = require("../validationSchemas");
const {
  createAndSendToken,
  changePassword,
  loginUser
} = require("../utils/user");

async function create(req, res, next) {
  const body = { ...req.body };
  delete body.password;
  let merchant = await Merchant.findOne({ email: body.email });
  if (merchant) {
    return res.status(400).json({
      message:
        "The email you have entered is already associated with another account."
    });
  }
  merchant = await Merchant.findOne({ phone: body.phone });
  // Make sure user doesn't already exist
  if (merchant) {
    return res.status(400).json({
      message:
        "The phone you have entered is already associated with another account."
    });
  }
  merchant = await Merchant.findOne({ name: body.name });
  // Make sure user doesn't already exist
  if (merchant) {
    return res.status(400).json({
      message:
        "The name you have entered is already associated with another merchant."
    });
  }
  merchant = new Merchant(body);
  await merchant.setPassword(req.body.password);
  await merchant.save();

  return res.status(200).json({
    message: "the merchant has been created successfully",
    data: { body }
  });
}
async function login(req, res, next) {
  const { loginField, password, email, phone } = req.body;
  const options = {
    loginField,
    password,
    email,
    phone,
    Model: Merchant
  };
  const merchant = await loginUser(options);
  if (!merchant) {
    return res.status(400).json({ message: "some info are invalid" });
  }
  return res.status(200).json({
    token: merchant.generateToken()
  });
}
//resend the token by the email or phone of the user to the user mail
async function resendToken(req, res, next) {
  const { email, phone, password } = req.body;
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/merchants/resetPassword/`;
  const merchant = new Merchant();
  await merchant.setPassword(password);
  const sent = await createAndSendToken({
    type: "password",
    email,
    phone,
    Model: Merchant,
    tokenLength: 16,
    sendBy: "mail",
    resetUrl,
    extraData: merchant.password
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
  const reseted = await changePassword({ resetToken, Model: Merchant });
  if (reseted) {
    return res.status(200).json({
      message: "the password has been successfully changed"
    });
  }
  return res.status(400).json({
    message: "We were unable to find a valid token. Your token my have expired."
  });
}

async function getMerchants(req, res, next) {
  const merchants = await Merchant.find().select("-password");
  return res.status(200).json({
    length: merchants.length,
    merchants
  });
}
async function getMerchant(req, res, next) {
  const merchant = await Merchant.findById(req.params.id).select("-password");
  return res.status(200).json({
    merchant
  });
}
async function deleteMerchant(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Merchant);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const merchant = await Merchant.findByIdAndRemove(id);
  return res.status(200).json({
    merchant
  });
}
async function updateMerchant(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Merchant);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const merchant = await Merchant.findByIdAndUpdate(id, req.body, {
    new: true
  });
  return res.status(200).json({
    merchant
  });
}

module.exports = {
  create,
  login,
  resendToken,
  resetPassword,
  getMerchants,
  updateMerchant,
  deleteMerchant,
  getMerchant
};
