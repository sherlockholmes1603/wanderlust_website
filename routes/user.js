const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const passport = require("passport");


router.get("/signup", (req, res) => {
    res.render("user/signup.ejs")
});

router.post("/signup", wrapAsync( async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registerdUser = await User.register(newUser, password);   
        console.log(registerdUser);
        req.flash("success", `Welcome ${username} to Wanderlust`);
        res.redirect("/listings");
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
} ));


router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});

router.post("/login", 
            passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}), 
            async (req, res) => {
                req.flash("success", "Login successful! Welcome back to wanderlust");
                res.redirect("/listings");
} );


module.exports = router;