//All Middleware 
var middlewareObj = {};
var Campground    = require("../models/campground");
var Comment       = require("../models/comment");

//Check campground ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                } else {
                    // does the user own the campground?
                    // .equals Mongoose Method compares a String and an Object
                    if(foundCampground.author.id.equals(req.user._id)) {
                        next();                      
                    } else {
                        req.flash("error", "You do not have permission to do that");
                        // if not redirect
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that");
            // if not, redirect back
            res.redirect("back");
        }
};

//Check comment ownership
middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in?
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error", "Somthing is wrong with the comment");
                    res.redirect("back");
                } else {
                    // does the user own the campground?
                    // .equals Mongoose Method compares a String and an Object
                    if(foundComment.author.id.equals(req.user._id)) {
                        req.flash("success", "The comment has been updated");
                        next();                      
                    } else {
                        req.flash("error", "You do not have permission to update the comment");
                        // if not redirect
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that");
            // if not, redirect back
            res.redirect("back");
        }
};

//Check Login
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;