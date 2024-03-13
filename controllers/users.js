module.exports.signup = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registerdUser = await User.register(newUser, password);   
        console.log(registerdUser);
        req.login(registerdUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", `Welcome ${username} to Wanderlust`);
            res.redirect("/listings");
        });
        
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderSignup = (req, res) => {
    res.render("user/signup.ejs")
};

module.exports.login = async (req, res) => {
    req.flash("success", "Login successful! Welcome back to wanderlust");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect("/listings");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("user/login.ejs");
};


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })

};