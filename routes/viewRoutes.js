const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const authController1 = require('../controllers/authController1');

const router = express.Router();


router.get("/", authController.isLoggedIn,viewsController.home);
  
router.get("/agent",authController1.isLoggedIn, viewsController.shopkeeper);

router.get("/account",authController.protect, viewsController.account);

  
module.exports = router;
  