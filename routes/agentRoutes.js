const express = require('express');
const authController1 = require('./../controllers/authController1');
const agentController=require('./../controllers/agentController');

const router = express.Router();

router.post('/signup', agentController.uploadUserPhoto, agentController.resizeUserPhoto, authController1.signup);
router.post('/login', authController1.login);
router.get('/logout', authController1.logout);
router.patch('/update', authController1.protect, agentController.uploadUserPhoto, agentController.resizeUserPhoto, agentController.update);

module.exports = router;