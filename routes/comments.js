var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware/");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new",{campground: campground});     
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
    // create new comment
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
               } else {
    // connect new comment to campground
                    //add username and id to comment
                    //user is available because isLoggedIn requires login 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground show page
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
               }
            });
        }
    });
});

//Comments Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            req.flash("error", "This is not your comment");
            res.redirect("back");
        } else {
            // pass the campground id (in the req.params.id) by creating the campground_id 
            res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
        }
    });
});

//Comments Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comments Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      } else {
          req.flash("success", "The comment has been deleted");
          res.redirect("/campgrounds/" + req.params.id);
      }
  });
});

module.exports = router;