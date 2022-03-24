const express = require('express');
const authController1 = require('./../controllers/authController1');
const agentController=require('./../controllers/agentController');
const productController=require('./../controllers/productController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', agentController.uploadUserPhoto, agentController.resizeUserPhoto, authController1.signup);
router.post('/login', authController1.login);
router.get('/logout', authController1.logout);
router.patch('/update', authController1.protect, agentController.uploadUserPhoto, agentController.resizeUserPhoto, agentController.update);

router.get('/product', productController.getAll);
router.post('/product', authController1.protect, productController.uploadProductImages, productController.resizeProductImages, productController.add);
router.patch('/product', authController1.protect, productController.uploadProductImages, productController.resizeProductImages, productController.update);
router.delete('/product', authController1.protect, productController.delete);

router.post('/order', authController1.protect, agentController.updateorder1);
router.put('/order', authController1.protect, agentController.updateorder);
router.delete('/order', authController1.protect, agentController.delorder);

module.exports = router;