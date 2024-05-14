const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.giveReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new Review saved");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async (req, res) => {
    let {id, rid} = req.params;
  
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: rid}});
  
    await Review.findByIdAndDelete(rid);
  
    res.redirect(`/listings/${id}`);
};


