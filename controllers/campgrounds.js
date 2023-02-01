const Campground = require('../models/campground');

module.exports.index =  async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.newCampgroundForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground =async (req,res,next)=>{    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    req.flash('success','Successfully created a new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {path: 'author'}
    }).populate('author')
    if(!campground){
        req.flash('error','Cannot find the Campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}
module.exports.editForm = async(req,res)=>{
    const {id} =req.params
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Cannot find the Campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}
module.exports.editCampground = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully Updated the Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteCampground = async(req,res)=>{
    const {id}  = req.params
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted a Campground')
    res.redirect('/campgrounds')
}