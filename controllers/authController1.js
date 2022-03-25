const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Agent = require('./../models/agentModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    }); 
  };

const createSendToken = (agent, statusCode, req, res) => {

  const token = signToken(agent._id);
  
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  
  agent.password = undefined;
  
  res.status(statusCode).json({
  status: 'success',
    token,
    data: {
        agent
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {

  if (req.file) req.body.photo = req.file.filename;

  const newAgent = await Agent.create(req.body);
  createSendToken(newAgent, 201, req, res);
});
  
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if Agent exists && password is correct
  const agent = await Agent.findOne({ email }).select('+password');
  
  if (!agent || !(await agent.correctPassword(password, agent.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  
  // 3) If everything ok, send token to client
  createSendToken(agent, 200, req, res);
});
  
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 10000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
  
exports.isLoggedIn = async (req, res, next) => {
   
  res.locals.agent =''
  if (req.cookies.jwt) {
    
    try { 
      
      //verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
  
      //Check if agent exists
      const currentAgent = await Agent.findById(decoded.id);
        
      if (!currentAgent) {
        return next();
      }
      
      //Check if Agent changed password after the token was issued
      if (currentAgent.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError('Agent recently changed password! Please log in again.', 401)
        );
      }
    
      res.locals.agent = currentAgent;
      req.agent=currentAgent;
      return next();
    
    } catch (err) {
        return next(); 
    }
  }
  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  if (!req.cookies.jwt) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  let token = req.cookies.jwt;
  
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if Agent still exists
  const currentAgent = await Agent.findById(decoded.id);
  if (!currentAgent) {
    return next(
      new AppError(
        'Please login first',
        401
      )
    );
  }

  // 4) Check if Agent changed password after the token was issued
  if (currentAgent.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Agent recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.agent = currentAgent;
  res.locals.agent = currentAgent;
  next();
});
