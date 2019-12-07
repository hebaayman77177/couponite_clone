const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const systemUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  }
});
// hashing the password
systemUserSchema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hash(password, config.get("bcrypt.saltRounds"));
};

// verifyning password
systemUserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// generating tokens
systemUserSchema.methods.generateToken = function() {
  const data = {
    _id: this._id,
    role: this.role
  };

  return jwt.sign(data, config.get("jwt.secret"), {
    expiresIn: config.get("jwt.options.expiresIn")
  });
};

systemUserSchema.statics.verifyToken = function(token) {
  try {
    const decoded = jwt.verify(token, config.get("jwt.secret"));
    return decoded;
  } catch (err) {
    //return err;
    return false;
  }
};
const SystemUser = mongoose.model("systemUser", systemUserSchema);

module.exports = SystemUser;
