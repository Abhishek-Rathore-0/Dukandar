const AppError = require('./../utils/appError');

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const Agent = require('./../models/agentModel');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value.replace(/"/g,"")}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  let message = `Invalid input data. ${errors.join('. ')}`;
  console.log(message)
  if(message.includes("Path `password`"))
    message="Password is shorter than the minimum allowed length (8)."
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Please log in first.', 401);

const handleJWTExpiredError = () =>
  new AppError('Please log in first.', 401);

const sendError = async(err, req, res) => {
  await check(req, res);
  if (req.originalUrl.startsWith('/api')) {
    
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    
  }

  // B) RENDERED WEBSITE
  
  if (err.isOperational) {
    let user="";
    if(req.originalUrl.includes("agent")){
      user="_agent";
    }
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
      user
    });
  }
  // B) Programming or other unknown error: don't leak error details
  
  console.error('ERROR ', err);
  
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
    
};

const check = async( req, res) => {
  res.locals.user ='';
  res.locals.agent='';

  if (req.cookies.jwt) {
    try { 
      
      //verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
  
      //Check if user exists
      const currentUser = await User.findById(decoded.id); 
      if (currentUser) {
        //Check if user changed password after the token was issued
        if (!currentUser.changedPasswordAfter(decoded.iat)) {
          req.user = currentUser;
          res.locals.user = "";
        }
      }
      
      //Check if agent exists
      const currentAgent = await Agent.findById(decoded.id);
      if (currentAgent) {
        //Check if Agent changed password after the token was issued
        if (!currentAgent.changedPasswordAfter(decoded.iat)) {
          res.locals.agent = "_agent";
          req.agent=currentAgent;  
        }
      }
      
    } catch (err) {
        console.log(err);
    }
  }  
};

module.exports = async(err, req, res, next) => {
    // console.log(err.stack);
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    let error = {...err, name: err.name};
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
        error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    await sendError(error , req, res);
};
