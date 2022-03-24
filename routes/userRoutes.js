const express = require('express');
const authController = require('./../controllers/authController');
const authController1 = require('./../controllers/authController1');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/update', authController.protect, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.update);

router.post("/cart/:id",authController.protect, userController.addCart);
router.put("/cart/:id",authController.protect, userController.editCart);
router.delete("/cart/:id",authController.protect, userController.deleteCartItem);
router.delete("/cart",authController.protect, userController.deleteCart);
 
router.post('/order', authController.protect, userController.addorder);
router.delete('/order', authController.isLoggedIn, userController.delorder);

module.exports = router;
