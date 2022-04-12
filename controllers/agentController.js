const multer = require('multer');
const sharp = require('sharp');
const Agent = require('./../models/agentModel');

const Order = require('../models/orderModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upolad images only.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `agent-${req.body.name}.jpeg`;
  
  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/image/agents/${req.file.filename}`);
  next();
});

exports.update = catchAsync(async (req, res, next)=>{
  const filteredBody = filterObj(req.body, 'name', 'email', 'category', 'shop', 'location', 'mobile', 'photo', 'city');
  
  if (req.file) filteredBody.photo = req.file.filename;
  
  //Update user document
  const updatedAgent = await Agent.findByIdAndUpdate(req.agent.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedAgent
    }
  });
});

exports.delorder = catchAsync(async(req, res, next)=>{
  
  const TransactionID = req.body.TransactionID;

  const Order1 = await Order.find({TransactionID});
  
  if (Order1.length == 0) {
    return next(new AppError('Please check your TransactionID.', 400));
  }
  else if(Order1[0].Delivered == true){
    return next(new AppError('Cannot be deleted.', 400));
  }
  else{
    await Order.deleteMany({TransactionID:TransactionID});
  }

  res.status(200).json({status: 'success'});
})

exports.updateorder = catchAsync(async(req, res, next)=>{
  
  const TransactionID = req.body.TransactionID;

  const Order1 = await Order.find({TransactionID});
  if (Order1.length == 0) {
    return next(new AppError('Please check your TransactionID.', 400));
  }
  else{
    const Order2 = await Order.find({TransactionID,Status:"pending"});
    if(Order2.length==0)
      await Order.updateMany({TransactionID,Status:"success"}, {Delivered:true},{})
    else
      return next(new AppError('First, Accept the order.', 400));
  }

  res.status(200).json({status: 'success'});
})

exports.updateorder1 = catchAsync(async(req, res, next)=>{
  
  const TransactionID = req.body.TransactionID;

  const Order1 = await Order.find({TransactionID});
  if (Order1.length == 0) {
    return next(new AppError('Please check your TransactionID.', 400));
  }
  else{
    const Order2 = await Order.find({TransactionID,Status:"success"});
    if(Order2.length==0)
      await Order.updateMany({TransactionID},{Status:"success"},{})
    else
      return next(new AppError('Please try again! ', 400));
  }

  res.status(200).json({status: 'success'});
})

exports.getAll = catchAsync(async(req, res, next) =>{
  let features;
    
  if(req.user && req.user.city){
    features = new APIFeatures(Agent.find({"city":req.user.city}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  }else{
    features = new APIFeatures(Agent.find({}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  }
  const doc = await features.query;
    
  res.locals.Agents = doc;
  res.locals.query = req.query;  

  next();
})
