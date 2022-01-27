const ProductModel = require('../models/productModel');


exports.home = async(req, res, next) => { 
    res.render("home",{
        title: 'Home'
    });
}
exports.index = async(req,res, next) => {
    res.render('index',{
        title:'Digital Dukaan'
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
