const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup, renderSignup, login, renderLogin, logout } = require("../controllers/users.js");



router.route("/signup")
.get(renderSignup)
.post(wrapAsync( signup ));


router.route("/login")
.get(renderLogin)
.post(  saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}), 
        login );

router.get("/logout", logout);



module.exports = router;