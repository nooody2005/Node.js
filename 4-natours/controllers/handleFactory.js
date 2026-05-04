const { Model } = require('mongoose');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');




exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);


  if (!doc) {
    return next(new AppError('Failed to create new document', 500));
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});


exports.updateOne = Model => catchAsync(async (req, res, next) => {
   
    const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators:true
    });

    res.status(200).json({
        status: 'success',
        data: {
            data:doc
        },
    });
   
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  //find ---> delte it
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that Id :)', 404));
  }

  //204---> no content
  res.status(204).json({
    status: 'success',
    data: null
  });
});


