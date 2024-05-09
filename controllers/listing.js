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
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(filename, ":  ", url)
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
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
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(filename, ":  ", url)
        listing.image.url = url;
        listing.image.filename = filename;
        await listing.save();
    }
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    req.flash("deleted", "The listing has been deleted successfully");
    // console.log(delListing);
    res.redirect("/");
};



