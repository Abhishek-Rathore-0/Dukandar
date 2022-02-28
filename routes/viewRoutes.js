const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const authController1 = require('../controllers/authController1');
const productController = require('../controllers/productController');

const router = express.Router();

router.get("/", authController.isLoggedIn, productController.getAll, viewsController.home);
router.get("/account",authController.protect, viewsController.account);
router.get("/cart",authController.protect, viewsController.cart);
router.get("/orders",authController.protect, viewsController.orders);
router.get("/paynow", authController.protect, viewsController.paynow)
router.get("/shop/:id", authController.isLoggedIn, viewsController.shop);


router.get("/index", authController.isLoggedIn, productController.getAll, viewsController.index);

router.get("/agent",authController1.isLoggedIn, viewsController.shopkeeper);
router.get("/agent-signup",authController1.isLoggedIn, viewsController.signup);
router.get("/agent-account", authController1.protect, viewsController.agentaccount);
router.get("/agent-products", authController1.protect, productController.getAll, viewsController.products);

router.get("/add-product", authController1.protect, viewsController.addproduct);

module.exports = router;