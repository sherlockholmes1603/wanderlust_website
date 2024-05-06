const mongoose = require("mongoose");
const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index, showListing, renderNewForm, createListing, renderEditForm, editListing, destroyListing } = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});




router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn, validateListing, upload.single("lisiting[image]"), wrapAsync(createListing));


router.get("/new", isLoggedIn, wrapAsync(renderNewForm));

router.route("/:id")
    .get(wrapAsync(showListing))
    .put(isLoggedIn, isOwner, wrapAsync(editListing))
    .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));




router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));


module.exports = router;


