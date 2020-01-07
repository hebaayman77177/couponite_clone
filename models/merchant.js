const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const merchantSchema = new mongoose.Schema({
  HQ: {
    id: mongoose.Schema.ObjectId
  },
  status: String,
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  HQAdressText: {
    type: String,
    trim: true
  },
  HQAdressAPI: {
    // GeoJSON
    type: {
      type: String,
      default: "Point",
      enum: ["Point"]
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  mobile: {
    type: String
  },
  website: String,
  socialMediaLinks: [String],
  AccountType: {
    type: String,
    enum: ["Free", "Premium"]
  },
  branches: [
    {
      id: mongoose.Schema.ObjectId,
      AdressText: [String],
      AdressAPI: {
        // GeoJSON
        type: {
          type: String,
          default: "Point",
          enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String
      }
    }
  ],
  contactPerson: {
    contactName: String,
    jobTitle: String,
    phone: String,
    email: String,
    payOutBy: {
      type: String,
      enum: ["cheque", "bankTransfere", "cashCollection"]
    }
  },
  category: {
    id: mongoose.Schema.ObjectId,
    name: String
  },
  createdAt: Date,
  updatedAt: Date,
  image: String,
  cover: String,
  email: String,
  phone: String,
  password: String
});
// hashing the password
merchantSchema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hash(password, config.get("bcrypt.saltRounds"));
};

// verifyning password
merchantSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// generating tokens
merchantSchema.methods.generateToken = function() {
  const data = {
    _id: this._id
  };

  return jwt.sign(data, config.get("jwt.secret"), {
    expiresIn: config.get("jwt.options.expiresIn")
  });
};

merchantSchema.statics.verifyToken = function(token) {
  try {
    const decoded = jwt.verify(token, config.get("jwt.secret"));
    return decoded;
  } catch (err) {
    //return err;
    return false;
  }
};
const Merchant = mongoose.model("merchant", merchantSchema);

module.exports = { Merchant, merchantSchema };
