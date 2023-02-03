const mongoose = require('mongoose')
const Review = require('./review')
const {Schema} = mongoose

const CampGroundSchema = new Schema({
    title: String,
    images:[
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

CampGroundSchema.post('findOneAndDelete', async function(campground){
    if(campground){
        await Review.deleteMany({
            _id:{
                $in:campground.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampGroundSchema)