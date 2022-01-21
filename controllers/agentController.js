const multer = require('multer');
const sharp = require('sharp');
const Agent = require('./../models/agentModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
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