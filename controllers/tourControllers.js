const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncMiddleware = require('./../utils/catchAsyncMiddleware');
const AppError = require('../utils/appError');
const { Schema } = require('mongoose');

exports.top5CheapAlias = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';

  next();
};

exports.createTour = catchAsyncMiddleware(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: 'ok',
    data: {
      tour,
    },
  });
});

exports.checkTourId = (req, res, next) => {
  const tourId = req.params.id;
};

exports.getMonthlyPlan = catchAsyncMiddleware(async (req, res, next) => {
  const year = req.params.year;

  const plans = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        totalTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        totalTours: -1,
      },
    },
    {
      $limit: 6,
    },
  ]);

  res.json({
    status: 'ok',
    length: plans.length,
    data: {
      plans,
    },
  });
});

exports.getToursStats = catchAsyncMiddleware(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5,
        },
      },
    },
    {
      $group: {
        _id: '$difficulty',
        noOfTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgRating: -1,
      },
    },
    {
      $match: {
        _id: {
          $ne: 'easy',
        },
      },
    },
  ]);

  res.json({
    status: 'ok',
    data: {
      stats,
    },
  });
});

exports.getTours = catchAsyncMiddleware(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.json({
    status: 'ok',
    length: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsyncMiddleware(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) throw new AppError(404, 'Tour not found!');

  res.json({
    status: 'ok',
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsyncMiddleware(async (req, res, next) => {
  // const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  const updatables = ['priceDiscount'];

  Object.keys(req.body).forEach(element => {
    if (!updatables.includes(element))
      throw new Error(`The field (${element}) can not be updated!`);
  });

  const tour = await Tour.findById(req.params.id);

  if (!tour) throw new AppError(404, 'Tour not found!');

  for (let key in req.body) {
    tour[key] = req.body[key];
  }

  await tour.save();

  res.json({
    status: 'ok',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsyncMiddleware(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) throw new AppError(404, 'Tour not found!');

  res.json({
    status: 'ok',
  });
});
