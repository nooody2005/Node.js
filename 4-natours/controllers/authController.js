const { promisify } = require('util');
const User = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const { token } = require('morgan');
const { findById } = require('../models/tourModel');

const signToken = id => {
  //jwt.sign({payload},secret);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1) check if email & password already exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    // 2) check if user exist & password correct
    const user = await User.findOne({ email }).select('+password');
    // const correct = await user.correctPassword(password, user.password);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) check everything is okay then send token
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
    });

    exports.protect = catchAsync(async (req, res, next) => {
    // 1) getting token and check if its there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);

    if (!token) {
        return next(
        new AppError('you are not logged in ..PLease login to get access', 401)
        );
    }

    // 2) verificaton token
    // jwt.verify(token,process.env.JWT_SECRET);
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    // 3) check if user still exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError('the user belongs to this token no longer exist :)', 401));
    }

    // 4) check if user changed password the jwt was issued
    if(freshUser.changePasswordAfter(decoded.iat)){
        return next (new AppError('User recently changed password Please log in again',401));
    }


    //Grant access to protected route
    req.user = freshUser;

    next();
});
