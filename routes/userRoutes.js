const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post("/cart/:id",authController.protect, userController.addCart);
router.put("/cart/:id",authController.protect, userController.editCart);
router.delete("/cart/:id",authController.protect, userController.deleteCartItem);
router.delete("/cart",authController.protect, userController.deleteCart);
 


module.exports = router;
