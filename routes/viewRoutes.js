const express = require('express');

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const authController1 = require('../controllers/authController1');
const productController = require('../controllers/productController');
const agentController = require('../controllers/agentController');

const router = express.Router();

router.get("/", authController.isLoggedIn, productController.getAll, viewsController.home);
router.get("/t&c", authController.isLoggedIn, viewsController.termcondition);
router.get("/faq", authController.isLoggedIn, viewsController.faq);
router.get("/about", authController.isLoggedIn, viewsController.about);

router.get("/account",authController.protect, viewsController.account);
router.get("/cart",authController.protect, viewsController.cart);
router.get("/orders",authController.protect, viewsController.orders);
router.get("/shop", authController.isLoggedIn, productController.getAll, agentController.getAll , viewsController.index);
router.get("/shop/:id", authController.isLoggedIn, viewsController.shop);
router.get("/product/:id", authController.isLoggedIn, viewsController.productpage);
router.get("/resetPassword/:token",authController.isLoggedIn,viewsController.forget)


router.get("/agent",authController1.isLoggedIn, viewsController.shopkeeper);
router.get("/agent-signup",authController1.isLoggedIn, viewsController.signup);
router.get("/agent-account", authController1.protect, viewsController.agentaccount);
router.get("/agent-products", authController1.protect, productController.getAll, viewsController.products);
router.get("/agent-dashboard", authController1.protect, productController.getAll, viewsController.agentdashboard);
router.get("/agent-orders", authController1.protect, productController.getAll, viewsController.orders_admin);
router.get("/add-product", authController1.protect, viewsController.addproduct);

module.exports = router;