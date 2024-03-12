const mongoose = require("mongoose");
const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js")
const router = express.Router();
const {isLoggedIn} = require("../middleware.js");




const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    else{
      next();
    }
  };


router.get("/",  wrapAsync( async (req, res) => {
    let allListings = await Listing.find();
    // console.log(chats);
    res.render("listings/index.ejs", {allListings});
}));
  
router.get("/new", isLoggedIn, wrapAsync( (req, res) => {
    res.render("listings/new.ejs");
}));
  
router.get("/:id",  wrapAsync( async (req, res) => {
      let {id} = req.params;
      const property = await Listing.findById(id).populate("reviews").populate("owner");
      if(!property){
        req.flash("error", "Listing you requested does not exits");
        res.redirect("/listings")
      }
      res.render("listings/show.ejs", {property})
}));
  
  
  
  
router.post("/", isLoggedIn, validateListing, wrapAsync( async (req, res, next)=>{
        // console.log(req.body.listing);
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
}));

  
  
  
router.get("/:id/edit", isLoggedIn, wrapAsync( async (req, res) => {
    let {id} = req.params;
    let property = await Listing.findById(id);
    if(!property){
      req.flash("error", "Listing you requested does not exits");
      res.redirect("/listings")
    }
    res.render("listings/edit.ejs", {property});
}));
  
router.put("/:id", isLoggedIn, wrapAsync( async (req, res) => {
      let {id} = req.params;
      console.log(req.body.listing);
      await Listing.findByIdAndUpdate(id, {...req.body.listing});
      // console.log(updatedChat);
      res.redirect(`/listings/${id}`);
}));
  
router.delete("/:id", isLoggedIn, wrapAsync( async (req, res) => {
    let {id} = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    req.flash("deleted", "The listing has been deleted successfully");
    // console.log(delListing);
    res.redirect("/");
}));

module.exports = router;


