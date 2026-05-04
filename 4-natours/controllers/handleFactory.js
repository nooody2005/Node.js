const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');



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
