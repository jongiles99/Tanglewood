var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//Root Route
router.get("/", function(req, res){
   res.render("landing"); 
});

// show reqister form
router.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       } 
        passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome to Tanglewood " + user.username);
        res.redirect("/campgrounds");
       });
   });
});


// show login form
router.get("/login", function(req,res){
   res.render("login"); 
});

// handing login logic
router.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    })
);

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out, come back soon!");
    res.redirect("/campgrounds");
});

module.exports = router;