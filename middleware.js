const {campgroundSchema , reviewSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.orignalUrl
        req.flash('error',"You are not logged in!!!")
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,msg);
    } else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    const{error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,msg);
    } else{
        next();
    }
}


module.exports.verifyAuthor = async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have the permission to do that')
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}

module.exports.verifyReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have the permission to do that')
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}