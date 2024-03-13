const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    // console.log(chats);
    res.render("listings/index.ejs", {allListings});
};



module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const property = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");
    if(!property){
      req.flash("error", "Listing you requested does not exits");
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", {property})
};


module.exports.createListing = async (req, res, next)=>{
    // console.log(req.body.listing);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let property = await Listing.findById(id);
    if(!property){
      req.flash("error", "Listing you requested does not exits");
      return res.redirect("/listings")
    }
    res.render("listings/edit.ejs", {property});
};


module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    // console.log(req.body.listing);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // console.log(updatedChat);
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    req.flash("deleted", "The listing has been deleted successfully");
    // console.log(delListing);
    res.redirect("/");
};



