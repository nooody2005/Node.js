const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//version 7
// mongoose.connect(process.env.DATABASE_LOCAL, {   //if we have local DB
mongoose.connect(DB, {
  useNewUrlParser: true,
  // useCreateIndex و useFindAndModify اتلغوا في Mongoose 7
})
.then(() => console.log('DB connection successful'))
// .catch(err => console.log('DB connection error:', err));

// //insert as a row 
// const testTour = new Tour({
//     // name: 'The Forest Hiker',
//     // rating:4.7,
//     // price:497
//     name: 'The Bark Camper',
//     price:997
// });

// // save tour row 
// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(error => {
//     console.log("Error : ",error);
// });


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`running on the port ${port}`);
});

process.on('unhandledRejection',err => {
  
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION :( Shutting down...');
  server.close(() => {
    //we get the server time to finish all the requests
    process.exit(1);
  });
});



//===========================================================================================

//in version 5 
// retuen promise
// mongoose.connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true ,
//     useFindAndModify: false
// }).then(con => {
//     console.log(con.connection);
//     console.log('DB connection successful');
// });
