const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handleFactory = require('./../controllers/handleFactory');


const multerStorage = multer.memoryStorage(); //image will store as buffer to make edits on it like resizing it before saving it in db
const multerFile = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images:)', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFile
});

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3}

    // upload.single('image')
    // upload.array('images',5)
]);

exports.resizeTourImages = catchAsync(async(req,res,next) => {
    // console.log(req.files);

    if(!req.files.imageCover || !req.files.images)  return next();

    // 1) Cover image
    req.body.imageCover = `tour-${req.params.id}--${Date.now()}--cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);

    
    // 2) images
    req.body.images= [];

    await Promise.all(
      
      req.files.images.map(async(file, i) => {
          const filename = `tour-${req.params.id}--${Date.now()}-${i+1}.jpeg`;
              
          // await sharp(req.files.imageCover[0].buffer)
          await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${filename}`);
          
          req.body.images.push(filename);

      })
    );

    
    next();
});

//middle ware
exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//GET Tour Stats
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //     $match : { _id: {$ne : 'EASY'} }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    results: stats.length,
    data: {
      stats
    }
  });
});
//====================================================================================
//GEt Monthly PLan
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 6
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan
    }
  });
});
// ===============================================================================
//geospatial queries function
// tours-Within?distance=233&center =- 40,45 & unit=mi
// tours-Within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the formet lat,lng',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  // console.log(distance, lat, lng , unit);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});
//===============================================================================
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the formet lat,lng',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distances',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distances: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});

//================================================================================
exports.getAllTours = handleFactory.getAll(Tour);
exports.getTour = handleFactory.getOne(Tour, { path: 'reviews' });
exports.createTour = handleFactory.createOne(Tour);
exports.updateTour = handleFactory.updateOne(Tour);
exports.deleteTour = handleFactory.deleteOne(Tour);

//================================================================================
//================================================================================
//get all tours
// exports.getAllTours =catchAsync(async (req, res , next) => {

//     //EXCUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//     const tours = await features.query;
//     // const tours = await Tour.find(JSON.parse(queryStr));
//     // const tours = await Tour.find(queryObj);
//     // const tours = await Tour.find();

//     res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//         tours,
//     },
//     });

// });
//================================================================================
// get a tour with (URL + id)
// exports.getTour =catchAsync( async (req, res,next) => {

//     const id = req.params.id * 1;
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     //findOne("_id" : req.params.id )

//     if(!tour){
//         return next(new AppError('No tour found with that Id :)',404));
//     }

//     //find ---> get it
//     res.status(200).json({
//         status: 'success',
//         data: {
//         tour
//         },
//     });

// });

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   if (!newTour) {
//     return next(new AppError('Failed to create new tour', 500));
//   }

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   });
// });

//================================================================================

// exports.updateTour = catchAsync(async (req, res, next) => {

//     const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
//         new : true,
//         runValidators:true
//     });

//     res.status(200).json({
//         status: 'success',
//         data: {
//         tour:tour
//         },
//     });

// });
//================================================================================
//delete Tour

// exports.deleteTour = catchAsync(async (req, res, next) => {

//     //find ---> delte it
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) {
//     return next(new AppError('No tour found with that Id :)', 404));
//     }

//     //204---> no content
//     res.status(204).json({
//         status: 'success',
//         data: {
//         tour: null,
//         },
//     });

// });

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
