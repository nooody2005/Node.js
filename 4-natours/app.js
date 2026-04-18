const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//=============================================================================================================
// 1) GLOBAL MIDDLEWARES
//=============================================================================================================
//set Security HTTP headers
app.use(helmet())

// DEvelopment Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,  //to allow 100 requests from the same IP in one hour 
  message: 'TOO many request from this IP, please try again in an hour'
});

app.use('/api',limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit : '10kb'}));    // limitting data sended via body



//Serving Static files
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from middleware :)');
//   next();
// });

//Test middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  
  next();
});


//=============================================================================================================
// 2) HADLING ROUTES
//=============================================================================================================
// moved in routes folder in tourRouter.js & userRouter.js
//=============================================================================================================
//3) ROUTES
//=============================================================================================================

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  //make object from class AppError in the fil appError in utils folder  and send this error to it 
  next(new AppError(`can't find ${req.originalUrl} on this server :)`, 404));
});

app.use(globalErrorHandler);

//=============================================================================================================
//4) START SERVER
//=============================================================================================================
//moved in server.js
module.exports = app;
//=============================================================================================================

//=============================================================================================================
//=========================================== old trials ======================================================

/*app.get('/', (req,res) => {
    res.status(200).json({ messege:'hello from the server side'  , app:'Natours'});
});
 
app.post('/', (req,res) => {
    res.send("You can post in this :)");
});*/

//=========================================================================================================

/*app.get('/api/v1/tours',(req, res) => {
    res.status(200).json({
        status : 'success' ,
        results : tours.length,
        data :{
            tours 
        }
    });
});*/
//==========================================================================================================

/*app.get('/api/v1/tours/:id', (req, res) => {

    console.log(req.params);
    //get the id from request & convert it from string to number
    const id = req.params.id *1;
    const tour = tours.find(el => el.id === id);

    //not find id 
    if(!tour){
        res.status(404).json({
          status: 'failed to find tour Id :(',
          message:'Invalid Id'
        });
    }
    //find ---> get it
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
}); */

//=========================================================================================================
/*// post a tour ---> create
app.post('/api/v1/tours',(req, res) => {
  // console.log(req.body);
  // res.send('done');

  //newId = Id for tours[last index] + 1 ;
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id : newId }, req.body);
   tours.push(newTour);

   //add the new tour created to the file.json
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),error => {
    res.status(201).json({
      status: 'success',
      data: {
        tour : newTour
      }
    });
  });
});
 */
//=========================================================================================================

/*//patch tour ----> update
app.patch('/api/v1/tours/:id', (req, res) => {

    //not find id 
    if (req.params.id * 1 > tours.length) {
      res.status(404).json({
        status: 'failed to find tour Id :(',
        message: 'Invalid Id',
      });
    }
    //find ---> get it
    res.status(200).json({
      status: 'success',
      data: {
         tour:'<updated tour here>'
      },
    });
});*/

//=========================================================================================================

/*app.delete('/api/v1/tours/:id', (req, res) => {
  //not find id
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'failed to find tour Id :(',
      message: 'Invalid Id',
    });
  }
  //find ---> delte it
  //204---> no content
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
});*/
