const mongoose = require("mongoose");
const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");






router.post("/", isLoggedIn, validateReview, wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new Review saved");
    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:rid", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  let {id, rid} = req.params;

  await Listing.findByIdAndUpdate(id, {$pull: {reviews: rid}});

  await Review.findByIdAndDelete(rid);

  res.redirect(`/listings/${id}`);
}));




module.exports = router;