var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Add functionality in the passport-local-mongoose package to the Schema
// serializeUser and deserializeUser is added
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);