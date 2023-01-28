const { urlencoded } = require('express');
const express = require('express');
const path = require('path')
const Campground = require('./models/campground');
const Review = require('./models/review')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const ExpressError=require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync'); 
const {campgroundSchema , reviewSchema} = require('./schemas.js');
const { AsyncLocalStorage } = require('async_hooks');

mongoose.set('strictQuery',true)
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error",console.error.bind(console,"CONNECTION ERROR:"))
db.once("open",()=>{
    console.log("DATABASE CONNECTED")
});

const app = express();

//SET PROPERTIES
app.engine('ejs', ejsMate)
app.set('view engine','ejs') 
app.set('views',path.join(__dirname,'views'))

//MIDDLEWARE
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,msg);
    } else{
        next();
    }
}

const validateReview = (req,res,next)=>{
    const{error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,msg);
    } else{
        next();
    }
}

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campgrounds',catchAsync (async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds',validateCampground,catchAsync (async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError(400,"Invalid Campground Data")
    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
}))


app.get('/campgrounds/:id',catchAsync (async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    res.render('campgrounds/show',{campground})
}))

app.get('/campgrounds/:id/edit',catchAsync (async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground})
}))

app.put('/campgrounds/:id',validateCampground,catchAsync (async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id',catchAsync (async(req,res)=>{
    const {id}  = req.params
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

//REVIEW ROUTING
app.post('/campgrounds/:id/reviews' ,validateReview, catchAsync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async(req,res,next)=>{
    const {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    res.redirect(`/campgrounds/${id}`)
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,'Page not found'))
})

app.use((err, req,res,next)=>{
    const{status =500} = err;
    if(!err.message) err.message="something went wrong"
    res.status(status).render('error',{err})
})

app.listen(3000,()=>{
    console.log('ACTIVE PORT:3000')
})