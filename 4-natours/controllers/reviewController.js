const { status } = require('express/lib/response');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const handleFactory =  require('./../controllers/handleFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {

    let filter = {};    //to get all reviews on a tour
    if(req.params.tourId)  filter = {tour : req.params.tourId};


    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data:{
            reviews
        }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    //Allow nested routes
    if(!req.body.tour)   req.body.tour = req.params.tourId;
    if(!req.body.user)  req.body.user = req.user.id;


    const newReview = await Review.create(req.body);

    res.status(200).json({
        status: 'success',
        data:{
            review: newReview
        }
    })
});

exports.deleteReview = handleFactory.deleteOne(Review);