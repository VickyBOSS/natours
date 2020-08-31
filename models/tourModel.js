const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "A tour must have a name"],
  },
  duration: {
    type: Number,
    required: [true, "A tour must have duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    trim: true,
    required: [true, "A tour must have a difficulty level"],
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  ratingsAverage: {
    type: Number,
    min: 1,
    max: 5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: true,
    trim: [true, "A tour must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model("Tour", schema);

module.exports = Tour;
