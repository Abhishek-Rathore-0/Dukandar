const Product = require('../models/productModel');
const Cart=require('../models/cartModel');
const User = require('./../models/userModel');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// For image------------------------------------------------------------
const multer = require('multer');
const sharp = require('sharp');

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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.body.name}.jpeg`;
  
  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/image/users/${req.file.filename}`);
  next();
});

// ------------------------------------------------------------------------------------------


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };

exports.update = catchAsync(async (req, res, next)=>{
    const filteredBody = filterObj(req.body, 'name', 'email', 'location', 'mobile', 'photo', 'city');
    
    if (req.file) filteredBody.photo = req.file.filename;
    //Update user document
    const updateduser= await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updateduser
      }
    });
  });


exports.addCart = async(req, res, next)=>{
    const userid = req.user.id;
    if (userid) {
        const {id} = req.params;
        
        const cartfind = await Cart.find({
            UserID: userid,
            ProductID: id
        });

        if (cartfind.length == 0) {
            const cartItems = await Cart.find({UserID: userid});
            if(cartItems.length !=0){
                const product1 = await Product.find({_id:cartItems[0].ProductID});
                const product2 = await Product.find({_id:id});
                if(product1[0].shopId != product2[0].shopId)
                    return next(new AppError('Please empty your cart to order from that shop.', 400));
                    
            }

            const cartobject = new Cart({
                UserID: userid,
                ProductID: id,
                Quantity: 1
            });
            await cartobject.save();
        }else{
            if (cartfind[0].Quantity != 9) {
                const incrementqty = cartfind[0].Quantity + 1;
                const Cartput = await Cart.findOneAndUpdate(
                    { UserID: userid, ProductID: id},
                    { Quantity: incrementqty },
                    { runValidators: true, new: true, useFindAndModify: false }
                );
            }
        }
    } else {
        return next(new AppError('Login first', 400));
    }
    res.status(200).json({ status: 'success' });
}   

exports.editCart = async(req, res, next)=>{
    const { id } = req.params;

    const { Quantity} = req.body;
    
    if (Quantity<0 && Quantity>10) {
        return next(new AppError('Quantity is between in range of 0 to 10 at one order.', 400));
      }
    
    const Cartput = await Cart.findOneAndUpdate(
      { UserID: req.user.id, ProductID: id},
      { Quantity: Quantity },
      { runValidators: true, new: true, useFindAndModify: false }
    );
    
    res.status(200).json({ status: 'success' });
}

exports.deleteCartItem = async(req, res, next)=>{
    const { id } = req.params;
    const cartItem = await Cart.findOneAndDelete({
        UserID: req.user.id,
        ProductID: id,
    });

    res.status(200).json({ status: 'success' });
}

exports.deleteCart = async(req, res, next)=>{
    const cartItem = await Cart.deleteMany({
        UserID: req.user.id
    });

    res.status(200).json({ status: 'success' });
}
