const express = require('express');
const router = express.Router({mergeParams:true});

const Campground = require('../models/campground')
const Review = require('../models/review')

const {campgroundSchema, reviewSchema} = require('../schemas.js');

const ExpressError=require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync'); 


const validateReview = (req,res,next)=>{
    const{error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,msg);
    } else{
        next();
    }
}

router.post('/' ,validateReview, catchAsync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Posted a review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId',catchAsync(async(req,res,next)=>{
    const {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash('success','Successfully Deleted the Review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;