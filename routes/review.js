const mongoose = require("mongoose");
const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js")
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");



const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    else{
      next();
    }
  };


router.post("/", validateReview, wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new Review saved");
    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:rid", wrapAsync(async (req, res) => {
  let {id, rid} = req.params;

  await Listing.findByIdAndUpdate(id, {$pull: {reviews: rid}});

  await Review.findByIdAndDelete(rid);

  res.redirect(`/listings/${id}`);
}));




module.exports = router;