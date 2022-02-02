const ProductModel = require('../models/productModel');
const Cart = require('../models/cartModel');
const AgentModel = require('../models/agentModel');


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
exports.cart= async(req, res, next) => {
    const userid = req.user.id;
    const cartItem = await Cart.find({ UserID: userid });
    
    let shopName="";
    let arrayy = [];
    for (let cart of cartItem) {
      let cartProduct = await ProductModel.find({ _id: cart.ProductID });
      arrayy.push(cartProduct);
    }
    
    if(cartItem.length!=0){
        let agentp = await AgentModel.find({_id:arrayy[0][0].shopId});
        shopName=agentp[0].shop;
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
        shopName
    })
}

exports.account = async(req, res, next) =>{
    res.status(200).render('account',{
        title: 'Account'
    });
}

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
