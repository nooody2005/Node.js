const AppError = require('./../utils/appError');
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`; 
    return new AppError(message,400);
}
const handleDublicateErrorDB =(err) => {
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];  // in old versions
    const value = err.keyValue.name;
    const message = `dublicate field name: ${value}..please use another value :)`;
    return new AppError(message,400);
}
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    //Operational, trusted error:send message to client
    if(err.isOperational){

        res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });

        //Programming or other unknown error: don't leak error details
    }else{
        console.log('errrrrror',err);

        //send generic message   500 ---> maybe bug :(
        res.status(500).json({
          status: 'error',
          message: 'something wrong :('
        });
    }
};




module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err,res);
  }else if (process.env.NODE_ENV === 'production'){
    let error = { ...err };
    error.message = err.message;   //we add this to copy important property
    error.name = err.name;
    // let error = err;

   if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateErrorDB(error);

   sendErrorProd(error, res);
  }

};

