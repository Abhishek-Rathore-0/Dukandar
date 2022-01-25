const express = require('express');
const authController1 = require('./../controllers/authController1');
const agentController=require('./../controllers/agentController');
const productController=require('./../controllers/productController');

const router = express.Router();

router.post('/signup', agentController.uploadUserPhoto, agentController.resizeUserPhoto, authController1.signup);
router.post('/login', authController1.login);
router.get('/logout', authController1.logout);
router.patch('/update', authController1.protect, agentController.uploadUserPhoto, agentController.resizeUserPhoto, agentController.update);

router.post('/product', authController1.protect, productController.uploadProductImages, productController.resizeProductImages, productController.add);
router.patch('/product', authController1.protect, productController.uploadProductImages, productController.resizeProductImages, productController.update);


module.exports = router;