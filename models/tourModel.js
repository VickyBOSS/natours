const mongoose = require('mongoose');
const validator = require('validator');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'A tour must have a name'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a difficulty level'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either - easy, medium, difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be equal to or above 1'],
      max: [5, 'Rating must be equal to or below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this only points to current doc on NEW doc creation, not when updating
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be below actual price',
      },
    },
    summary: {
      type: String,
      required: true,
      trim: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    toObject: {
      virtuals: true,
      versionKey: false,
    },
  }
);

// DOCUMENT MIDDLEWARE - only runs when using .save or .create
schema.pre('save', function (next) {
  console.log(this);
  next();
});

schema.virtual('durationInWeek').get(function () {
  return this.duration / 7;
});

schema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

const Tour = mongoose.model('Tour', schema);

module.exports = Tour;
