const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


//middle ware 
exports.aliasTopTour = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

//GET Tour Stats
exports.getTourStats = catchAsync(async (req, res ,next) => {
   
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper : '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRatings: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1}
            },
            // {   
            //     $match : { _id: {$ne : 'EASY'} }
            // }
        ]);

        res.status(200).json({
            status: 'success',
            results: stats.length,
            data: {
                stats,
            },
        });
    
});
//====================================================================================
//GEt Monthly PLan 
exports.getMonthlyPlan = catchAsync (async (req,res , next) => {

    const year = req.params.year * 1 ;
    const plan = await Tour.aggregate([
        {
            $unwind : '$startDates'
        },
        {
            $match: {
                startDates : {
                    $gte : new Date(`${year}-01-01`),
                    $lte : new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group : {
                _id : { $month : '$startDates' } ,
                numTourStarts : { $sum : 1 },
                tours : { $push : '$name' }
            }
        },
        {
            $addFields : { month : '$_id'}
        },
        {
            $project : {_id : 0}
        },
        {
            $sort : { numTourStarts : -1}
        },
        {
            $limit : 6
        }
    ]);

    res.status(200).json({
        status: 'success',
        results: plan.length,
        data: {
            plan,
        },
    });
    
});
// ===============================================================================
//================================================================================
//get all tours
exports.getAllTours =catchAsync(async (req, res , next) => {
 
    //EXCUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;
    // const tours = await Tour.find(JSON.parse(queryStr));
    // const tours = await Tour.find(queryObj);
    // const tours = await Tour.find();
    
    res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
        tours,
    },
    });
    
});
//================================================================================
// get a tour with (URL + id)
exports.getTour =catchAsync( async (req, res,next) => {
    
    const id = req.params.id * 1;
    const tour = await Tour.findById(req.params.id).populate('reviews');
    //findOne("_id" : req.params.id )

    if(!tour){
        return next(new AppError('No tour found with that Id :)',404));
    }

    //find ---> get it
    res.status(200).json({
        status: 'success',
        data: {
        tour
        },
    });

});
//================================================================================
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  // شرط Optional: التأكد إن الـ newTour اتعمل فعلاً
  if (!newTour) {
    return next(new AppError('Failed to create new tour', 500));
  }

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

// exports.createTour = catchAsync(async (req, res ,next) => {
    
//     const newTour = await Tour.create(req.body);

//     if (!tour) {
//     return next(new AppError('No tour found with that Id :)', 404));
//     }

//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour
//       }
//     });
  
// });

//================================================================================
exports.updateTour = catchAsync(async (req, res, next) => {
   
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators:true
    });

    res.status(200).json({
        status: 'success',
        data: {
        tour:tour
        },
    });
   
});
//================================================================================
//delete Tour
exports.deleteTour = catchAsync(async (req, res, next) => {

    //find ---> delte it
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
    return next(new AppError('No tour found with that Id :)', 404));
    }

    //204---> no content
    res.status(204).json({
        status: 'success',
        data: {
        tour: null,
        },
    });


});












//=============================================================================
                    //dealing with file.json
//=============================================================================
// const fs = require('fs');
// const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );    no need for this now


// exports.checkId = (req , res , next , val) => {
//     if (req.params.id * 1 > tours.length) {
//        return res.status(404).json({
//         status: 'failed to find tour Id :(',
//         message: 'Invalid Id',
//       });
//     }
//     next();
// };

// exports.checkBody = (req , res ,next ) => {
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status:'failed',
//             message:'check name or price if missed :)'
//         });
//     }
//     next();
// };
//================================================================================
// //get all tours
// exports.getAllTours = (req, res) => {
//     console.log(req.requestTime);
//     res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
//   });
// };
//================================================================================
// // get a tour with (URL + id)
// exports.getTour = (req, res) => {
//   console.log(req.params);
//   get the id from request & convert it from string to number
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);

//   //find ---> get it
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };
//================================================================================
// exports.createTour = (req, res) => {
//   console.log(req.body);
//   res.send('done');

//   newId = Id for tours[last index] + 1 ;
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);

//   //add the new tour created to the file.json
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (error) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

//================================================================================
// exports.updateTour = (req, res) => {
//   //find ---> get it
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<updated tour here>',
//     },
//   });
// };
//================================================================================
// //delete Tour
// exports.deleteTour = (req, res) => {
//   //find ---> delte it
//   //204---> no content
//   res.status(204).json({
//     status: 'success',
//     data: {
//       tour: null,
//     },
//   });
// };