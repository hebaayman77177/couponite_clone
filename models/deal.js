const mongoose = require("mongoose");
const moment = require("moment");

const dealSchema = new mongoose.Schema({
  //TODO: shoud be enum depending on the type
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
  dealStartDate: Date,
  dealEndDate: Date,
  visible: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  //   maxCoupon: Number,
  minBuy: Number,
  maxBuy: Number,
  //enum
  paymentType: String,
  liveDeal: Boolean,
  item: [
    new mongoose.Schema({
      type: String,
      quantity: Number,
      originalPrice: Number,
      finalPrice: Number,
      merchantPersentage: Number, ////////// could be deleted
      yallaDealzPersentage: Number,
      visible: Boolean,
      minBuy: Number,
      maxBuy: Number,
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: Date,
      youtubeLink: String,
      reviewRate: Number,
      couponValidFrom: Date,
      couponValidTo: Date,
      size: [String],
      color: [String],
      dayRoom: [
        new mongoose.Schema({ Day: Date, roomsNumber: Number, price: Number })
      ],
      for: {
        type: String,
        enum: ["men", "women", "children", "teenagers"]
      }
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
