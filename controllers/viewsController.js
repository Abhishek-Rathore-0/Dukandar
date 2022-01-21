const Product = require('../models/productModel');


exports.home = async(req, res, next) => { 
    res.render("home",{
        title: 'Home'
    });
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
    const Products = await Product.find();

    res.status(200).render('products',{
        title: 'Products',
        Products
      });
}