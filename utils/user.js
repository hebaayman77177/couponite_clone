const sendEmail = require("../utils/mail");
const { Token } = require("../models/token");

async function createAndSendToken(options) {
  const {
    type,
    email,
    phone,
    Model,
    tokenLength,
    sendBy,
    resetUrl,
    extraData
  } = options;
  const user = await Model.findOne({
    $or: [{ email }, { phone }]
  });
  if (!user) return false; //unable to find the token
  const resetToken = Token.generateToken(tokenLength);
  const token = new Token({
    _userId: user._id,
    token: Token.hashToken(resetToken),
    type,
    extraData
  });
  await token.save();

  //depending on you want to send it via email or phone add the following code in if condition
  if (sendBy === "mail") {
    const mailOptions = {
      email: user.email,
      subject: "Account Verification Token",
      message: `please go to this url:${resetUrl +
        resetToken} to reset your password`
    };
    await sendEmail(mailOptions);
  }
  return true; //sent successfuly
}
async function changePassword(options) {
  //get the user of the token
  const { resetToken, Model } = options;
  let token = Token.hashToken(resetToken);
  token = await Token.findOne({ token, type: "password" });
  if (!token) return false;

  const user = await Model.findOne({
    _id: token._userId
  });
  if (!user) return false;

  await Model.findByIdAndUpdate(token._userId, {
    password: token.extraData
  });
  await Token.findOneAndDelete({ _id: token._id });

  return true;
}
async function loginUser(options) {
  const { loginField, password, Model } = options;
  let { email, phone } = options;
  //convert login field either to email or phone
  if (loginField) {
    const reg = new RegExp("^[0-9]+$");
    if (reg.test(loginField)) {
      phone = loginField;
    } else {
      email = loginField;
    }
  }
  //check if there is a user with  correct password
  let user;
  console.log(options);
  if (email) {
    user = await Model.findOne({ email: email });
    // eslint-disable-next-line no-else-return
  } else if (phone) {
    user = await Model.findOne({ phone: phone });
  }
  console.log("user",user);
  if (!user || !(await user.verifyPassword(password))) {
    console.log("here");
    return false;
  }
  return user;
}
module.exports = {
  createAndSendToken,
  changePassword,
  loginUser
};
