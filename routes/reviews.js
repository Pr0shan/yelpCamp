const express = require('express');
const router = express.Router({mergeParams:true});
const {validateReview, isLoggedIn, verifyReviewAuthor } = require('../middleware')
const Campground = require('../models/campground')
const Review = require('../models/review')
 
const catchAsync = require('../utils/catchAsync'); 



router.post('/' , isLoggedIn ,validateReview,  catchAsync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Posted a review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn , verifyReviewAuthor ,catchAsync(async(req,res,next)=>{
    const {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash('success','Successfully Deleted the Review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;