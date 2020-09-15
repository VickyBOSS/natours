/* eslint-disable no-console */
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

process.on('uncaughtException', err => {
  console.log(err.name, ' : ', err.message);
  console.log(err);
  console.log('UNCAUGHT EXCEPTIONS! Shutting down the app...');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to database!');
  });

const server = app.listen(port, () =>
  console.log(`App is running on port ${port}`)
);

process.on('unhandledRejection', err => {
  console.log(err.name, ' : ', err.message);
  console.log('UNHANDLED REJECTION! Shutting down the app...');
  server.close(() => {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
});

// const fs = require('fs');
// const Tour = require('./models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours.json`)
// );

// console.log(`${tours.length} tours to import`);

// const imp = async () => {
//   try {
//     const ntours = await Tour.create(tours);
//     console.log(ntours);
//   } catch (err) {
//     console.log(err);
//   }
// };

// imp();
