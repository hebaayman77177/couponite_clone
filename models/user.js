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
  phone: {
    type: String,
    unique: true
  },
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
  role: { type: String, default: "user" },
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
    _id: this._id,
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

const emailValidationSchema = Joi.string()
.email({ minDomainSegments: 2 });


const phoneValidationSchema = Joi.string()
.pattern(/^01[0125]\d{8}$/, { name: 'numbers'});


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

  phone: Joi.string()
  .pattern(/^01[0125]\d{8}$/, { name: 'numbers'})
  .required(),
  
  birthDate: Joi.date(),
  
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  role: Joi.string()
    .min(3)
    .max(30),
  job: Joi.string()
  .min(3)
  .max(50),

  isVerified: Joi.bool(),

  address: addressValidationSchema
});

function validateUser(req) {
  const result = userValidationSchema.validate(req.body);
  return result;
}
module.exports = {
  User: UserModel,
  validate: validateUser,
  emailValidationSchema: emailValidationSchema,
  phoneValidationSchema: phoneValidationSchema
};
