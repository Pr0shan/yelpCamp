const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users');
const user = require('../models/user');

router.route('/register')
    .get( users.registerForm )
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), catchAsync(users.loginUser))


router.get('/logout', users.logout);

module.exports = router;