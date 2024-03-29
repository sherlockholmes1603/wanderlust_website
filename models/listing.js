const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js');


const listingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        set: (v) => v === "" 
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5RMMXw51lInNW69mxzwUBllKDyMzChJFwUrL7GKjqxoZvDPAKCM1190oCGg&s" 
                : v,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5RMMXw51lInNW69mxzwUBllKDyMzChJFwUrL7GKjqxoZvDPAKCM1190oCGg&s"
    },
    price:Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing){
        await Review.deleteMany({_id : {$in: listing.reviews} });
    }
    
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;





