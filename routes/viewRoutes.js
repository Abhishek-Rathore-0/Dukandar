const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();


router.get("/", authController.isLoggedIn,viewsController.home);
  
router.get("/s",authController.isLoggedIn, viewsController.shopkeeper);

  
module.exports = router;
  