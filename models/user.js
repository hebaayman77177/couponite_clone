//
//
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

const userSchema = new mongoose.Schema({
  firstName: String, // required
  lastName: String, // required
  password: String, // required,
  phone: Number,
  email: {
    type: String,
    index: { unique: true }
  },
  address: {
    country: String,
    city: String
  },
  birthDate: Date,
  job: String,
  role: String,
  isVerified: { type: Boolean, default: false }
});

// hashing the password
userSchema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hash(password, config.get("bcrypt.saltRounds"));
};

// verifyning password
userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// generating tokens
userSchema.methods.generateToken = function() {
  const data = {
    id: this._id,
    role: this.role
  };

  return jwt.sign(data, config.get("jwt.secret"), {
    expiresIn: config.get("jwt.options.expiresIn")
  });
};

userSchema.statics.verifyToken = function(token) {
  try {
    const decoded = jwt.verify(token, config.get("jwt.secret"));
    return decoded;
  } catch (err) {
    //return err;
    return false;
  }
};

const UserModel = mongoose.model("user", userSchema);

const addressValidationSchema = Joi.object({
  country: Joi.string()
    .min(3)
    .max(20),
  city: Joi.string()
    .min(3)
    .max(20)
});

const userValidationSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(30)
    .required(),

  lastName: Joi.string()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .min(3)
    .max(30)
    .required(),
  phone: Joi.number().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  role: Joi.string()
    .min(3)
    .max(30),

  isVerified: Joi.bool(),

  address: addressValidationSchema
});

function validateUser(req) {
  const result = userValidationSchema.validate(req.body);
  return result;
}
module.exports = {
  User: UserModel,
  validate: validateUser
};

// let user = new User({});
// user.setPassword(122554587552);
// user.save();

// Usre.verifyToken();
