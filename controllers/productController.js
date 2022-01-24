const multer = require('multer');
const sharp = require('sharp');
const Product = require('./../models/productModel');

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
