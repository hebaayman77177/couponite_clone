const mongoose = require("mongoose");
const moment = require("moment");

const dealSchema = new mongoose.Schema({
  //TODO: shoud be enum depending on the type
  //ex:food,cloth,hotel
  type: String,

  merchant: {
    name: String,
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
    },
    branches: [
      {
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
    ]
  },

  category: {
    name: String,
    slug: [String],
    ancestors: [String]
  },

  dealStartDate: {
    type: Date,
    default: new Date()
  },
  dealEndDate: { type: Date, default: new Date("4000-01-01T00:00:00Z") },

  visible: { type: Boolean, default: true },

  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: Date,

  minBuy: { type: Number, default: 1 },
  maxBuy: { type: Number, default: Infinity },

  //enum
  paymentType: String,

  liveDeal: Boolean, //?

  merchantPersentage: Number, ////////// could be deleted
  yallaDealzPersentage: Number,

  couponValidFrom: Date,
  couponValidTo: Date,

  youtubeLink: String,
  reviewRate: Number,

  for: {
    type: String,
    enum: ["men", "women", "children", "teenagers"]
  },

  totalQuantity: Number,

  item: [
    new mongoose.Schema({
      quantity: { type: Number, default: Infinity },
      originalPrice: Number,
      finalPrice: Number,

      size: String,
      color: String,
      Day: Date
    })
  ],

  mainDescription: String,
  mainMetaDescription: String,
  mainMetaKeywords: String,
  mainTags: [String],
  mainHeights: String,
  mainConditions: String,
  Description: [[String, String]],
  MetaDescription: [[String, String]],
  MetaKeywords: [[String, String]],
  Tags: [[String, [String]]],
  Heights: [[String, String]],
  Conditions: [[String, String]]
});

dealSchema.set("toObject", { virtuals: true });
dealSchema.set("toJSON", { virtuals: true });

dealSchema.virtual("remainingDays").get(function() {
  return moment(this.dealEndDate).diff(moment(), "days");
});
dealSchema.virtual("discountAmount").get(function() {
  return ((this.originalPrice - this.finalPrice) / this.originalPrice) * 100;
});

const Deal = mongoose.model("deal", dealSchema);

module.exports = { Deal };
