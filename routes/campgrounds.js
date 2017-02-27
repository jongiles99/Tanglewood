var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
//when requiring a folder without specifying a name "index" is assumed
var middleware  = require("../middleware");

//INDEX display a list of all campgrounds
router.get("/", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
           res.render("campgrounds/index", 
           {campgrounds:allCampgrounds,
            currentUser: req.user}
           );
       }
    });
});

//CREATE add a new campground to the DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to campgrounds array 
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW display a form to add a new campground
//The "/NEW" route needs to preceed the "/:id" route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - show campground detail for one campground
router.get("/:id", function(req, res){
    //find the campground with the id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
        //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT Campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found");
            res.render("back");
        } else {
        res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE Campground
router.put("/:id",  middleware.checkCampgroundOwnership, function(req, res){
// to use "req.body.campground" the names in the form need to use name="campground[item name here]"
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
         if(err){
            res.redirect("/campgrounds");
        } else { 
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;