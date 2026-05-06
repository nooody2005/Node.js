const User = require('./../models/userModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { all } = require('../app');
const handleFactory = require('./../controllers/handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

exports.updateMe = catchAsync(async (req ,res , next) => {
  // 1) Create error if user POSTs password data
  if(req.body.password || req.body.passwordConfirm){
    return next( new AppError('THis route is not for password updates... please use / updateMy password :)',400));
  }
  
  // 2) filtered out unwanted fields that are not allowed to be updated    ...cuz for examble can't update your role if you are just user and wanna be an admin :)
  
  const filterdBody = filterObj(req.body, 'name','email');
  
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true
  });
  
  // const user = await User.findById(req.user.id);
  // user.name='Nada';
  // await user.save();
  
  res.status(200).json({
    status: 'success',
    data:{
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getMe = (req,res,next) => {
  req.params.id = req.user.id;
  next();
}

//=========================================================
exports.getAllUsers = handleFactory.getAll(User);
exports.getUser = handleFactory.getOne(User);
exports.createUser = handleFactory.createOne(User);
exports.updateUser = handleFactory.updateOne(User);
exports.deleteUser = handleFactory.deleteOne(User);
//========================================================

// exports.getAllUsers = catchAsync(async (req, res, next) => {
  
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users
//     }
//   });
// });


// exports.getUser = (req, res) => {
  //   res.status(500).json({
    //     status: 'error',
    //     message: "This route is n't yet defined"
    //   });
    // };
    

// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: "This route is n't yet defined"
//   });
// };


// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: "This route is n't yet defined"
//   });
// };

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: "This route is n't yet defined"
//   });
// };

