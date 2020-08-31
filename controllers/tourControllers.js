const Tour = require('./../models/tourModel');

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'ok',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.getTours = async (req, res) => {
  try {
    // 1 A ) Filtering Basics
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1 B ) Advance Filtering
    let queryObjString = JSON.stringify(queryObj);
    queryObjString = queryObjString.replace(
      /\b(lt|lte|gt|gte)\b/g,
      (match) => `$${match}`
    );

    let query = Tour.find(JSON.parse(queryObjString));

    // 2 ) Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    } else {
      query = query.sort('ratingsAverage');
    }

    const tours = await query;

    res.json({
      status: 'ok',
      length: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.json({
      status: 'ok',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      status: 'ok',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.json({
      status: 'ok',
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};
