const multer = require('multer');
const sharp = require('sharp');
const Product = require('./../models/productModel');
const APIFeatures = require('./../utils/apiFeatures');
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

exports.uploadProductImages = upload.fields([{ name: 'images', maxCount: 3 }]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
    if (!req.files.images) return next();
    
    req.body.images = [];
  
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${req.body.name}-${i + 1}.jpeg`;
        
        await sharp(file.buffer)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/image/products/${filename}`);
        
        req.body.images.push(filename);
      })
    );
    next();
});
  

exports.add = catchAsync(async (req, res, next)=>{
  const newProduct = await Product.create(req.body);
      
    res.status(200).json({
        status: 'success',
        data: {
         product: newProduct
        }
      });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.update = catchAsync(async(req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'description', 'category', 'price', 'quantity', 'images');
  
  //Update product document
  const updatedProduct = await Product.findByIdAndUpdate(req.body.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedProduct
    }
  });
});

exports.delete = catchAsync(async(req,res,next) => {
  
  const doc = await Model.findByIdAndDelete(req.body.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
})

exports.getAll = catchAsync(async(req, res, next) =>{
  
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    if (req.originalUrl.startsWith('/api')) {
    
      // SEND RESPONSE
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc
        }
      });
    }
    else{
      res.locals.Products = doc;
      res.locals.query = req.query;
    }
    next();
})
