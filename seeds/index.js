const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.set('strictQuery',true)
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error",console.error.bind(console,"CONNECTION ERROR:"))
db.once("open",()=>{
    console.log("DATABASE CONNECTED")
});

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB= async()=>{
    await Campground.deleteMany({});
    for(let i =0;i<50;i++){
        const random1000= Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20)+10
        const camp=new Campground({
            title:`${sample(descriptors)} ${sample(places)}`,
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae vero eveniet explicabo totam, ea sed vitae praesentium? Maxime facere quasi possimus explicabo? Officia saepe voluptatum quo nam. Illo, molestiae ex.',
            price
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close( )
})