const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const method = require("method-override");
const app = express();
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user.js");


const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");



main().then(() => {
  console.log("Connection Successful");
}).catch(err => console.log(err));

async function main() {
await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);

app.use(method("_method"));
app.use(express.urlencoded({extended: true}));


const sessionOptions = {
    secret: "AsecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 3600 * 1000,
      maxAge: 7 * 24 * 3600 * 1000,
      httpOnly: true
    }
};


app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.deleted = req.flash("deleted");
  res.locals.error = req.flash("error");
  next();
});



app.use("/listings", listingRoute);

app.use("/listings/:id/reviews", reviewRoute);

app.use("/", userRoute);





app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something Went Wrong!"} = err;
  res.render("error.ejs", {statusCode, message});
});


app.listen("8080", () => {
    console.log("Server is listening to port 8080");
  });
  

