const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const config = require("config");
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

  if (!(email || phone) || !password) {
    return res.status(400).json({ message: "some info are invalid" });
  }
  //check if there is a user with  correct password
  let user;
  if (email) {
    user = await User.findOne({ email: email, isVerified: true });
    // eslint-disable-next-line no-else-return
  } else if (phone) {
    user = await User.findOne({ phone: phone, isVerified: true });
  }
  if (!user || !(await user.verifyPassword(password))) {
    return res.status(400).json({ message: "some info are invalid" });
  }
  return res.json({
    token: user.generateToken()
  });
}

async function signup(req, res, next) {
  //TODO:refactor validation code
  try {
    // Check for validation errors
    const validation = validate(req);
    if (validation.error) {
      return res
        .status(422)
        .json({ message: validation.error.details[0].message });
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
        .digest("hex"),
      type: "login"
    });
    // Save the verification token
    await token.save();

    const options = {
      email: user.email,
      subject: "Account Verification Token",
      message: resetToken
    };
    await sendEmail(options);

    return res.status(200).json({
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
  const token = await Token.findOne({ token: retoken, type: "login" });
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
  //TODO:validate that the type exist as if not it will through the error from mongoose
  const { type, email, phone } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { phone }]
  });
  if (!user)
    return res
      .status(400)
      .json({ message: "We were unable to find a user with this info." });
  if (type === "login" && user.isVerified)
    return res.status(400).send({
      message: "This account has already been verified. Please log in."
    });

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
  const user = await User.findOne({ email: req.body.email });
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

  const user = await User.findOne({
    _id: token._userId
  });
  if (!user)
    return res
      .status(400)
      .json({ message: "We were unable to find a user for this token." });

  await User.findByIdAndUpdate(token._userId, { password: token.extraData });
  await Token.findOneAndDelete({ _id: token._id });

  return res.status(200).json({
    status: "success",
    message: "the password has been successfully changed"
  });
}


async function changePhone(req, res, next) {
  // //get the token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const token = new Token({
    _userId: req.user.id,
    token: crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex"),
    type: "phone",
    extraData: req.body.phone
  });
  await token.save();

  const user = await User.findOne({ _id: req.user.id });
  //send the token to the email of the user
  const options = {
    email: user.email,
    subject: "token to reset your password",
    message: resetToken
  };
  await sendEmail(options);

  return res.status(200).json({
    message: "Token sent to email!"
  });
}
async function resetPhone(req, res, next) {
  //get the user of the token
  const { verificationToken } = req.body;
  let token = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  token = await Token.findOne({ token, type: "phone" });
  if (!token)
    return res.status(400).json({
      message:
        "We were unable to find a valid token. Your token my have expired."
    });
  //TODO:validate the phone before saving
  await User.findByIdAndUpdate(req.user.id, { phone: token.extraData });
  await Token.findOneAndDelete({ _id: token._id });

  return res.status(200).json({
    message: "the phone has been successfully changed"
  });
}

// user functions

// get my data
async function getMyInfo(req, res, next) {
  // user must be logged in
  try {

    const user = await User.findById(req.user._id);
    const returnUser = _.omit(user, ['password', 'isVerified', 'role']);
    return res.json({ user: returnUser });
  } catch (err) {
    next(err);
  }
}

// edit my data
async function editMyInfo(req, res, next) {

  try {
    let user = await User.findById(req.user._id);
    //const returnUser = _.omit(user, ['password', 'isVerified', 'role']);
    let newdata = _.omit(
      req.body,
      ['email', 'password', 'phone', 'role', 'isVerified', 'facebookId']
    );
    /** here set user data, send it and save */
    user.set(newdata);
    await user.save();

    return res.json(
      { user: _.omit(user,['password', 'role','isVerified']) }
      );
  } catch (err) {
    next(err);
  }
}


// change my password
async function changeMyPasword(req, res, next){
  //get old password and new password 
  // compare old password with one in the data base
  // save the new password hashed
  const {oldPassword, newPassword} = req.body;
  try{
    let user = await User.findById(req.user._id);
    if (user.verifyPassword(oldPassword)){

      user.setPassword(newPassword);
      res.json({message: 'password changed successfully'});
    }else{
      res.statusCode = 422;
      res.json({message: 'please enter valid password'});
    }
  }catch(err){
    next(err);
  }
}

//
module.exports = {
  create: create,
  login: login,
  signup: signup,
  confirmToken: confirmToken,
  resendToken: resendToken,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  changePhone: changePhone,
  resetPhone: resetPhone,
  getMyInfo: getMyInfo,
  editMyInfo: editMyInfo,
  changeMyPasword: changeMyPasword
};
