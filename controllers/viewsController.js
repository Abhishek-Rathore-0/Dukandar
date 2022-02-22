const ProductModel = require('../models/productModel');
const Cart = require('../models/cartModel');
const AgentModel = require('../models/agentModel');
const AppError = require('./../utils/appError');
const ObjectId = require('mongoose').Types.ObjectId;

exports.home = async(req, res, next) => { 
    res.render("home",{
        title: 'Home'
    });
}
exports.index = async(req, res, next) => {
     res.render('index',{
        title:'Digital Dukaan'
    })
}

exports.shop = async(req, res, next)=>{
    const {id} = req.params;
    
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id){
            let shopObject = await AgentModel.find({_id:id});
            if(shopObject.length !=0 ){    
                let products = await ProductModel.find({shopId:id});
                return res.status(200).render('shop',{
                    title: shopObject[0].shop,
                    shop:shopObject[0],
                    products
                });
            }      
        }
    }
    return next(new AppError("Something went wrong",400));     
}

exports.cart= async(req, res, next) => {
    const userid = req.user.id;
    const cartItem = await Cart.find({ UserID: userid });
    
    let shop;
    let arrayy = [];
    for (let cart of cartItem) {
      let cartProduct = await ProductModel.find({ _id: cart.ProductID });
      arrayy.push(cartProduct);
    }
    
    if(cartItem.length!=0){
        let agentp = await AgentModel.find({_id:arrayy[0][0].shopId});
        shop=agentp[0];
    }

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
    
    count = (await Cart.find({ UserID: req.user.id })).length;

    res.render('cart',{
        title:'cart',
        count,
        cartItem: cartItem,
        arrayy: arrayy,
        finaltotal,
        subtotal,
        shipping,
        tax,
        shop
    })
}


exports.orders = async(req, res, next) =>{
    res.status(200).render('orders',{
        title: 'Order'
    });
}

exports.account = async(req, res, next) =>{
    res.status(200).render('account',{
        title: 'Account'
    });
}

//------------------------------------------------------------Agent---------------------------------------------//

exports.shopkeeper = async(req, res, next) => { 
    res.status(200).render("agent",{
        title: 'Agent'
    });
}

exports.signup = async(req, res, next) => { 
    res.status(200).render("signup",{
        title: 'SIgnup'
    });
}

exports.agentaccount = async(req, res, next) =>{
    res.status(200).render('aacount',{
        title: 'Account'
    });
}

exports.products = async(req, res, next) =>{
    
    res.status(200).render('products',{
        title: 'Products'
      });
}

exports.addproduct = async(req, res, next) =>{
    
    res.status(200).render('addproduct',{
        title: 'Products',
      });
}
