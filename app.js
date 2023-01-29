const { urlencoded } = require('express');
const express = require('express');
const path = require('path')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const session =  require('express-session')
const flash = require('connect-flash')
const ExpressError=require('./utils/ExpressError')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

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
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret:'Secret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})


app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews' , reviews)

app.get('/',(req,res)=>{
    res.render('home')
})


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