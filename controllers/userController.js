const Product = require('../models/productModel');
const Cart=require('../models/CartModel');
const AppError = require('./../utils/appError');

exports.addCart = async(req, res, next)=>{
    const userid = req.user.id;
    if (userid) {
        const {id} = req.params;
        
        const cartfind = await Cart.find({
            UserID: userid,
            ProductID: id
        });

        if (cartfind.length == 0) {
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
        new AppError('Login first', 400);
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

exports.deleteCart = async(req, res, next)=>{
    const { id } = req.params;
    const cartItem = await Cart.findOneAndDelete({
        UserID: req.user.id,
        ProductID: id,
    });

    res.status(200).json({ status: 'success' });
}
