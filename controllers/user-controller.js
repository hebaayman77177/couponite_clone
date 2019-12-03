const _ = require("lodash");
const crypto = require("crypto");
const { User, validate } = require("../models/user");
const { Token } = require("../models/token");
const sendEmail = require("../utils/mail");

async function create(req, res, next) {
  const result = validate(req);
  if (result.error) {
    res.statusCode = 422;
    //return res.send(result.error.details[0].message);
    return res.json(result);
  }
  res.json(result);
}

async function login(req, res, next) {
  //check the email and password exist
  const { email, password, phone } = req.body;
  if (!(email || phone) || !password) {
    return res.status(400).json({ message: "some info are invalid" });
  }
  //check if there is a user with  correct password
  if (email) {
    const user = await User.findOne({ email: email, isVerified: true });
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(400).json({ message: "some info are invalid" });
    }
    return res.json({
      token: user.generateToken(),
      user: _.pick(user, ["firstName", "lastName", "_id", "role"])
    });
    // eslint-disable-next-line no-else-return
  } else if (phone) {
    const user = await User.findOne({ phone: phone, isVerified: true });
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(400).json({ message: "email or passsord is invalid" });
    }
    return res.json({
      token: user.generateToken(),
      user: _.pick(user, ["firstName", "lastName", "_id", "role"])
    });
  }
}

async function signup(req, res, next) {
  try {
    // Check for validation errors
    const result = validate(req);
    if (result.error) {
      return res.status(422).json({ message: result.error.details[0].message });
    }
    // Make sure this account doesn't already exist
    let user = await User.findOne({ email: req.body.email });

    // Make sure user doesn't already exist
    if (user)
      return res.status(400).json({
        message:
          "The email address you have entered is already associated with another account."
      });

    // Create and save the user
    const body = { ...req.body };
    delete body.password;
    delete body.role;
    delete body.isVerified;
    user = new User(body);
    await user.setPassword(req.body.password);
    await user.save();

    // Create a verification token for this user
    const resetToken = crypto.randomBytes(32).toString("hex");
    const token = new Token({
      _userId: user._id,
      token: crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")
    });

    // Save the verification token
    await token.save();
    const options = {
      email: user.email,
      subject: "Account Verification Token",
      message: resetToken
    };
    await sendEmail(options);
    res.status(200).json({
      message: `A verification email has been sent to ${user.email} `
    });
  } catch (err) {
    next(err);
  }
}

async function confirmToken(req, res, next) {
  // Find a matching token
  const retoken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");
  const token = await Token.findOne({ token: retoken });
  if (!token)
    return res.status(400).json({
      message:
        "We were unable to find a valid token. Your token my have expired."
    });
  // If we found a token, find a matching user
  const user = await User.findOne({
    _id: token._userId,
    email: req.body.email
  });

  if (!user)
    return res
      .status(400)
      .json({ message: "We were unable to find a user for this token." });
  if (user.isVerified)
    return res.status(400).json({
      message: "This user has already been verified."
    });

  // Verify and save the user
  user.isVerified = true;
  await user.save();
  await Token.findOneAndDelete({ _id: token._id });
  res
    .status(200)
    .json({ message: "The account has been verified. Please log in." });
}

async function resendToken(req, res, next) {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ message: "We were unable to find a user with that email." });
  if (user.isVerified)
    return res.status(400).send({
      message: "This account has already been verified. Please log in."
    });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const token = new Token({
    _userId: user._id,
    token: crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")
  });

  // Save the verification token
  await token.save();

  const mailOptions = {
    email: user.email,
    subject: "Account Verification Token",
    message: resetToken
  };
  await sendEmail(mailOptions);

  res.status(200).send({
    message: `A verification email has been sent to ${user.email} .`
  });
}

async function forgotPassword(req, res, next) {
  //get the user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .send({ message: "there is no user with this email" });
  }
  //get the token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const token = new Token({
    _userId: user._id,
    token: crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")
  });
  await token.save();

  // console.log(resetToken);
  //send the token to the email of the user
  const options = {
    email: user.email,
    subject: "token to reset your password",
    message: resetToken
  };
  await sendEmail(options);

  res.status(200).json({
    status: "success",
    message: "Token sent to email!"
  });
}

async function resetPassword(req, res, next) {
  //get the user of the token
  let token = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");
  token = await Token.findOne({ token });
  if (!token)
    return res.status(400).send({
      message:
        "We were unable to find a valid token. Your token my have expired."
    });
  const user = await User.findOne({
    _id: token._userId,
    email: req.body.email
  });
  if (!user)
    return res
      .status(400)
      .json({ message: "We were unable to find a user for this token." });
  await user.setPassword(req.body.password);
  // console.log(req.body.password);
  await user.save();
  await Token.findOneAndDelete({ _id: token._id });
  res.status(200).json({
    status: "success",
    message: "the password has been successfully changed"
  });
}

async function changePhone(req, res, next) {
  //get the user
  const decoded = User.verifyToken(req.body.token);
  if (!decoded) {
    return res.status(401).json({ message: "not authorized" });
  }
  console.log(decoded);
  
  /** why we ge the user ? */
  const user = await User.findOne({ _id: decoded.id });
  if (!user) {
    return res.status(401).json({ message: "not authorized" });
  }
  // //get the token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const token = new Token({
    _userId: user._id,
    token: crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")
  });
  await token.save();

  // console.log(resetToken);
  //send the token to the email of the user
  const options = {
    email: user.email,
    subject: "token to reset your password",
    message: resetToken
  };
  await sendEmail(options);

  return res.status(200).json({
    status: "success",
    message: "Token sent to email!"
  });
}
async function resetPhone(req, res, next) {
  const decoded = User.verifyToken(req.body.token);
  console.log(decoded);
  if (!decoded) {
    return res.status(401).json({ message: "not authorized" });
  }

  const user = await User.findOne({ _id: decoded.id });
  if (!user) {
    return res.status(401).json({ message: "not authorized" });
  }
  console.log(user);
  //get the user of the token
  let token = crypto
    .createHash("sha256")
    .update(req.body.verificationToken)
    .digest("hex");
  token = await Token.findOne({ token });
  if (!token)
    return res.status(400).json({
      message:
        "We were unable to find a valid token. Your token my have expired."
    });
  await Token.findOneAndDelete({ _id: token._id });
  //TODO:validate the phone before saving
  user.phone = req.body.phone;
  await user.save();
  return res.status(200).json({
    message: "the phone has been successfully changed"
  });
}
module.exports = {
  create: create,
  login: login,
  signup: signup,
  confirmToken: confirmToken,
  resendToken: resendToken,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  changePhone: changePhone,
  resetPhone: resetPhone
};
