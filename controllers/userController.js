const Product = require('../models/productModel');
const Cart=require('../models/cartModel');
const Order=require('../models/orderModel');
const AgentModel=require('../models/agentModel');
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
    cb(new AppError('Not an image! Please upload images only.', 400), false);
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
    
    if(filteredBody.city != req.user.city){
      await Cart.deleteMany({UserID: req.user.id});
    }
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
      let user = await User.find({_id:userid});
      if(user[0].mobile == undefined || user[0].location == undefined)
        return next(new AppError('Please complete your profile first.', 400));
        
          const {id} = req.params;
        
        const cartfind = await Cart.find({
            UserID: userid,
            ProductID: id
        });

        if (cartfind.length == 0) {
            const cartItems = await Cart.find({UserID: userid});
            const product2 = await Product.find({_id:id});
            let user = await User.find({_id:userid});
            let agent = await AgentModel.find({_id:product2[0].shopId});
            if(user[0].city!=agent[0].city)
              return next(new AppError('Sorry! This shop is not available at your location.',400));

            if(cartItems.length !=0){
                const product1 = await Product.find({_id:cartItems[0].ProductID});
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
        return next(new AppError('Quantity must be between 0 and 10.', 400));
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
    await Cart.deleteMany({
        UserID: req.user.id
    });

    res.status(200).json({ status: 'success' });
}

exports.addorder = catchAsync(async(req, res, next)=>{
  const UserID = req.user.id;
  let user = await User.find({_id:UserID});
  if(user[0].mobile != undefined && user[0].location != undefined)
  {
    const cartItem = await Cart.find({UserID});
    const Ordercount = (await Order.find({UserID})).length;
    let random = Math.floor((Math.random() * 1000) + 1);
    if (cartItem.length == 0) {
      return next(new AppError('Please add items to the cart to order.', 400));
    }
    else{
      
      let arrayy = [];
      for (let cart of cartItem) {
        let cartProduct = await Product.find({ _id: cart.ProductID });
        arrayy.push(cartProduct);
      }
      
      let agentp = await AgentModel.find({_id:arrayy[0][0].shopId});
      let shop = agentp[0];
      
      let subtotal = 0;
      let i = 0;
      for (let arr of arrayy) {
        subtotal = subtotal + arr[0].price * cartItem[i].Quantity;
        i++;
      }

      let shipping = 100;
      if (subtotal >= 1000 || subtotal == 0) shipping = 0;
      let tax = subtotal / 10;
      finaltotal = subtotal + shipping + tax;
      
      i=0;
      for (let arr of arrayy) {
        const ProductID = arr[0]._id;
        const ShopID = shop._id;
        const Quantity = cartItem[i].Quantity;
        const Date1 = new Date().toISOString().slice(0, 10);
        const TransactionID = UserID+(1+Ordercount)+random;
        const PaymentMode = "--";
        const prod= await Product.find({_id:arr[0]._id});
        const Price=prod[0].price;
        const Status ="pending"
        
        const NewOrder = new Order({
          UserID,
          ProductID,
          ShopID,
          Quantity,
          OrderDate: Date1,
          TransactionID,
          PaymentMode,
          Price,
          Total: finaltotal,
          Status
        });
        await NewOrder.save();
        i++;
      }
    }
    await Cart.deleteMany({ UserID: UserID });
    return res.status(200).json({status: 'success'});
  }
  return next(new AppError('Please add your address and mobile no.', 400));
})

exports.delorder = catchAsync(async(req, res, next)=>{
  const UserID = req.user.id;
  const TransactionID = req.body.TransactionID;
  const Order1 = await Order.find({UserID,TransactionID});
  
  if (Order1.length == 0) {
    return next(new AppError('Please check your TransactionID.', 400));
  }
  else if(Order1[0].Delivered == true){
    return next(new AppError('Cannot be deleted.', 400));
  }
  else if(Order1[0].Status == "success"){
    return next(new AppError('Please contact the shop to delete this order.', 400));
  }
  else{
    await Order.deleteMany({ UserID: UserID,TransactionID:TransactionID});
  }

  res.status(200).json({status: 'success'});
})