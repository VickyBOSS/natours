/* eslint-disable no-console */
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => console.log(err.message));

app.listen(port, () => console.log(`App is running on port ${port}`));

// const fs = require("fs");
// const Tour = require("./models/tourModel");

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
