const ProductModel = require('../models/productModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const AgentModel = require('../models/agentModel');
const UserModel = require('../models/userModel');
const AppError = require('./../utils/appError');
const ObjectId = require('mongoose').Types.ObjectId;
const crypto = require('crypto');
const Product = require('../models/productModel');

exports.home = async(req, res, next) => { 
    let orders;
    if(req.user && req.user.city){
        const agent =await AgentModel.find({"city":req.user.city});
        let id=[];
        for (let a of agent){
            id.push(a._id);
        }
        orders = await Order.find({ShopID:id});
    } else{
        orders = await Order.find({});
    }
    // orders = await Order.find({});
    
    let dict= {};
    for(let order of orders){
        if(dict[order.ProductID]==undefined){
            dict[order.ProductID]=order.Quantity;}
        else{
            dict[order.ProductID]=dict[order.ProductID]+order.Quantity;}
    }

    var items = Object.keys(dict).map((key) => { return [key, dict[key]]});
    items.sort((first, second) => { return first[1] - second[1] });
    var keys = items.map((e) => { return e[0] });
    keys.reverse();
    
    let tproduct=[];
    let tshopkey=[];
    let tshop=[];
    for(let key of keys){
        let product= await Product.find({_id:key});
        tproduct.push(product[0]);
        if(!tshopkey.includes(product[0].shopId))
        tshopkey.push(product[0].shopId);
    }
    for(let key of tshopkey){
        tshop.push((await AgentModel.find({_id:key}))[0]);
    }

    res.locals.tproduct=tproduct;
    res.locals.tshop=tshop;
   
    res.render('index',{
        title:'Samaan Mart'
    })
}
exports.index = async(req, res, next) => {
    res.render("home",{
        title: 'Shops'
    }); 
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
    return next(new AppError("Something went wrong!",400));     
}

exports.productpage = async(req, res, next)=>{
    const {id} = req.params;
    
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id){
            let product = await ProductModel.find({_id:id});
            if(product.length !=0 ){    
                let products = await ProductModel.find({shopId:product[0].shopId});
                let shop = await AgentModel.find({_id:product[0].shopId});
                let shops = await AgentModel.find({});
                return res.status(200).render('product',{
                    title: product[0].name,
                    shop:shop[0],
                    shops,
                    product:product[0],
                    products
                });
            }      
        }
    }
    return next(new AppError("Something went wrong!",400));     
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
        title:'Cart',
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
    const OrderList= await Order.find({UserID:req.user.id});
    OrderList.reverse();

    let OrderProduct = [];
    let shops =[];
    for (let orders of OrderList) {
        let OProduct = await ProductModel.find({ _id: orders.ProductID });
        OrderProduct.push(OProduct);
        let shop = await AgentModel.find({_id: orders.ShopID });
        shops.push(shop);
    }

    res.status(200).render('orders',{
        title: 'Order',
        OrderList,
        OrderProduct,
        shops
    });
}

exports.account = async(req, res, next) =>{
    res.status(200).render('account',{
        title: 'Account'
    });
}

exports.forget = async(req, res, next) =>{
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
  
    const user = await UserModel.findOne({
        passwordResetToken: hashedToken
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    res.status(200).render('newpass',{
        title: 'Password Reset',
        token:req.params.token,
        email:user.email
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
        title: 'SignUp'
    });
}

exports.agentaccount = async(req, res, next) =>{
    res.status(200).render('aacount',{
        title: 'Account'
    });
}

exports.agentdashboard = async(req, res, next) =>{
    
    let transid="";
    let checker = [];
    let monthcheck = [0,0,0,0,0,0,0,0,0,0,0,0]
    let orderCount = 0;
    let orderdata = await Order.find({ShopID:req.agent._id,Delivered:true});
    let user = [];

    let categories = [];
    for(let product of res.locals.Products){
        categories.push(product.name);
        checker.push(0);
    }
    for(let data of orderdata){
        //console.log(data.OrderDate.toISOString().slice(5,7));
        if(transid!=data.TransactionID){
            orderCount=orderCount+1;
            for(let i=1;i<=12;i++){
                let month = parseInt(data.OrderDate.toISOString().slice(5,7));
                if(month==i){
                    monthcheck[i-1]++;
                }
            }
            // console.log(monthcheck);
        }
        transid=data.TransactionID

        const product1 = await ProductModel.find({_id: data.ProductID});
        // console.log(product1[0].pCategory);
        for(let i=0;i<checker.length;i++){
            if(categories[i]==product1[0].name){
                // console.log("hi");
                checker[i]=checker[i]+data.Quantity;
            }
        }
        if(!user.includes(data.UserID))
            user.push(data.UserID)
    }
    // console.log(checker,orderCount, user);
    const Date1 = new Date().toUTCString().slice(0, 16);
    const Time1 = new Date().toLocaleString().slice(9,22);   
    
    res.status(200).render('dashboard',{
        title: 'Dashboard',
        Date1,monthcheck,Time1,checker,orderCount,categories,userCount:user.length
    });
}

exports.orders_admin = async(req, res, next) =>{
    const user = await UserModel.find();
  
    let OrderList;
    OrderList = await Order.find({ShopID:req.agent._id}).sort({Status:-1,Delivered:-1});
    OrderList.reverse();

    let OrderProduct = [];
    for (let orders of OrderList) {
        let OProduct = await ProductModel.find({ _id: orders.ProductID });
        OrderProduct.push(OProduct);
    }
    res.status(200).render('orders_admin',{
        title: 'Orders',
        user, 
        OrderList,
        OrderProduct
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

exports.termcondition = async(req, res, next) =>{
    res.status(200).render('t&c',{
        title: 'Terms and Conditions',
      });
}

exports.faq = async(req, res, next) =>{
    res.status(200).render('faq',{
        title: 'FAQ',
      });
}

exports.about = async(req, res, next) =>{
    res.status(200).render('about',{
        title: 'About Us',
      });
}
