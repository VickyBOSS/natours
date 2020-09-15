const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const staticFilesPath = __dirname + '/public';

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(staticFilesPath));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.all('*', (req, res, next) => {
  const err = new AppError(404, `The route (${req.originalUrl}) is not found!`);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
