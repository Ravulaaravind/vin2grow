const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ["Shop all",
    "Sanchi Stupa",
    "Warli House",
    "Tiger Crafting",
    "Bamboo Peacock",
    "Miniaure Ship",
    "Bamboo Trophy",
    "Bamboo Ganesha",
    "Bamboo Swords",
    "Tribal Mask -1",
    "Tribal Mask -2",
    "Bamboo Dry Fruit Tray",
    "Bamboo Tissue Paper Holder",
    "Bamboo Strip Tray",
    "Bamboo Mobile Booster",
    "Bamboo Card-Pen Holder"
    ]
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  length: {
    type: Number,
    required: true,
    min: 0
  },
  width: {
    type: Number,
    required: true,
    min: 0
  },
  height: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isDiscountActive: {
    type: Boolean,
    default: false
  },
  discountStartDate: {
    type: Date
  },
  discountEndDate: {
    type: Date
  },
  offerPrice: {
    type: Number,
    min: 0
  },
  offerStartDate: {
    type: Date
  },
  offerEndDate: {
    type: Date
  },
  isOfferActive: {
    type: Boolean,
    default: false
  },
  expiryDays: {
    type: Number,
    default: 7
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 