const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.home = async(req, res, next) => { 
    res.render("home");
}

exports.shopkeeper = async(req, res, next) => { 
    res.status(200).render("shopkeeper");
}
