const express = require('express');
const authController1 = require('./../controllers/authController1');

const router = express.Router();

router.post('/signup', authController1.signup);
router.post('/login', authController1.login);
router.get('/logout', authController1.logout);

module.exports = router;
