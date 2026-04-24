const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// dotenv.config();
const Tour = require('./../../models/tourModel');
const { exit } = require('process');
dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const DB = 'mongodb://127.0.0.1:27017/natours';
// const DB = process.env.DATABASE;

// mongoose.connect(DB, {
//   useNewUrlParser: true,
// })
// .then(() => console.log('DB connection successful'))
// .catch(err => console.log('DB connection error:', err));

// const DB = process.env.DATABASE;
console.log(DB);
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful'))
  .catch(err => console.log('DB connection error:', err));

//Read file
const tours =JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));


const importData = async() => {
  
  try{
    await Tour.create(tours);
    console.log('created successfully :)');
  }catch(err) {
    console.log(err);
  }
  process.exit();
};

//delete all

const deleteData = async() => {
  try{
    await Tour.deleteMany();
    console.log('deleted successfully :)');
  }catch(err) {
    console.log(err);
  }
  process.exit();
}
if (process.argv[2] === '--import'){
  importData();
} else if (process.argv[2] === '--delete'){
  deleteData();
}
console.log(process.argv);


