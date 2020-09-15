const User = require('../models/userModel');
const cacheAsync = require('./../utils/catchAsyncMiddleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.createUser = cacheAsync(async (req, res) => {
  const user = new User(req.body);
  await user.save();

  res.status(201).send({
    status: 'ok',
    data: user,
  });
});

exports.login = cacheAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email });

  if (!user) throw new Error('Email is not registered!');

  const result = await bcrypt.compare(password, user.password);
  if (!result) throw new Error('Wrong password!');

  const resObj = {
    name: user.name,
    email: user.email,
    img: user.photo,
  };

  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

  res.json({
    status: 'ok',
    user: resObj,
    token,
  });
});
