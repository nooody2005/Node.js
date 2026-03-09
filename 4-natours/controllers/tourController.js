const Tour = require('./../models/tourModel');

//================================================================================
//get all tours
exports.getAllTours = async (req, res) => {
    try{
        console.log(req.query);
        //BUILD QUERY
        //1)FILTERING
        const queryObj = {...req.query};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //2)ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g ,match => `$${match}`);
        console.log(JSON.parse(queryStr));

        const tours = await Tour.find(JSON.parse(queryStr));

        // const tours = await Tour.find(queryObj);
        // const tours = await Tour.find();
        
        res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tours,
        },
      });
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
};
//================================================================================
// get a tour with (URL + id)
exports.getTour = async (req, res) => {
    try{
        const id = req.params.id * 1;
        const tour = await Tour.findById(req.params.id);
        //findOne("_id" : req.params.id )

        //find ---> get it
        res.status(200).json({
            status: 'success',
            data: {
            tour
            },
        });
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
};
//================================================================================
exports.createTour = async (req, res) => {
    // const newTour = new Tour({});
    // newTour.save();
    try{
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
            tour: newTour,
            },
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }

};

//================================================================================
exports.updateTour = async (req, res) => {
    try{
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

    }catch(err){
        res.status(400).json({
            status: 'fail',
            message:'Invalid data sent :('
        });
    }
};
//================================================================================
//delete Tour
exports.deleteTour = async (req, res) => {
    try{
        //find ---> delte it
        const tour = await Tour.findByIdAndDelete(req.params.id);
        //204---> no content
        res.status(204).json({
            status: 'success',
            data: {
            tour: null,
            },
        });

    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
};












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