const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync'); 
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn , validateCampground , verifyAuthor} = require('../middleware');
const { route } = require('./users');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground))

router.get('/new',isLoggedIn,campgrounds.newCampgroundForm)

router.route('/:id')
    .get(catchAsync (campgrounds.showCampground))
    .put(isLoggedIn,verifyAuthor,validateCampground,catchAsync (campgrounds.editCampground))
    .delete(isLoggedIn,verifyAuthor,catchAsync (campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn, verifyAuthor, catchAsync (campgrounds.editForm))



module.exports = router;