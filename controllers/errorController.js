const AppError = require('./../utils/appError');
const { Error } = require('mongoose');

/* eslint-disable no-console */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error : send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming, unknown error : don't send to client
  else {
    // 1) log error
    console.error('ERROR ', err);

    // 2) send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleCastErrorDB = err => {
  if (err.path === '_id') err.path = 'ID';
  return new AppError(400, `ERROR: Invalid ${err.path}: ${err.value}`);
};

const handleDuplicateFieldErrorDB = err => {
  let collection = '';
  if (err.message.includes('collection: natours.tours')) {
    collection = 'Tour';
  } else {
    collection = 'User';
  }

  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];
  return new AppError(
    400,
    `ERROR: A ${collection} with value ( ${key} = ${value} ) already exists!`
  );
};

const handleValidationErrorDB = err => {
  // console.log('ERROR 💯', err.name);
  const castErr = Object.keys(err.errors)[0];
  // console.log('Name of the Error    :', err.errors[castErr].name);

  if (err.errors[castErr].name === 'CastError')
    return new AppError(
      400,
      `ERROR: ${err.errors[castErr].path} must be a ${err.errors[castErr].kind}`
    );
  else return new AppError(400, err.message);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // console.log('------------------------------------------------------');
  // console.log('CastError            : ', err instanceof Error.CastError);
  // console.log('ValidationError      : ', err instanceof Error.ValidationError);
  // if (err instanceof Error.ValidationError) {
  //   const castErr = Object.keys(err.errors)[0];
  //   console.log('Name of the Error    :', err.errors[castErr].name);
  // }
  // console.log('------------------------------------------------------');

  // res.status(err.statusCode).json({
  //   error: err,
  // });

  if (process.env.NODE_ENV === 'development') {
    console.log(err.name);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    console.log(err.name === error.name);

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    else if (err.code === 11000) error = handleDuplicateFieldErrorDB(err);
    else if (err.name === 'ValidationError')
      error = handleValidationErrorDB(err);
    sendErrorProd(error, res);
  }
};
