const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email.js');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    }); 
  };

  
const createSendToken = async(user, statusCode, req, res) => {

  const token = signToken(user._id);
  
  await res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  
  user.password = undefined;
  
  res.status(statusCode).json({
  status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  const url = `${req.protocol}://${req.get('host')}/account`;
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, req, res);
});
  
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  
  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});
  
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 10000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
  
exports.isLoggedIn = async (req, res, next) => {
  res.locals.address = req.headers.host=="localhost:3000"?'http://'+req.headers.host+'/':'https://'+req.headers.host+'/';
      
  res.locals.user =''
  if (req.cookies.jwt) {
    
    try { 
      
      //verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
  
      //Check if user exists
      const currentUser = await User.findById(decoded.id);
        
      if (!currentUser) {
        return next();
      }
      
      //Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
    
      req.user = currentUser;
  
      res.locals.user = currentUser;
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

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  res.locals.address = req.headers.host=="localhost:3000"?'http://'+req.headers.host+'/':'https://'+req.headers.host+'/';
          
  next();
});
  
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no registered user with this email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    let protocol=`${req.protocol}`;
    if(req.get('host')!="localhost:3000")
      protocol=`${req.protocol}s`;
    
    const resetURL = `${protocol}://${req.get('host')}/resetPassword/${resetToken}`;
    console.log(resetURL);
    await new Email(user, resetURL).sendPasswordReset();
   
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
  
});
