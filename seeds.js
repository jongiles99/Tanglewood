var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var data = [
    {name: "Alcatraz Island", 
    image: "https://www.nps.gov/customcf/apps/CMS_HandF/ParkSearchPics/8E231188-1DD8-B71C-0EFFEC7EA3648226.jpg",
    description: "Alcatraz Island offers a close-up look at the site of the first lighthouse and US built fort on the West Coast, the infamous federal penitentiary long off-limits to the public, and the history making 18 month occupation by Indians of All Tribes. Rich in history, there is also a natural side to the Rock—gardens, tide pools, bird colonies, and bay views beyond compare."
    },
    {name: "Castle Mountains",
    image: "https://www.nps.gov/customcf/apps/CMS_HandF/ParkSearchPics/C9EF180A-1DD8-B71B-0B1551F65A80F5F3.jpg",
    description: "Castle Mountains represents some of the most unique elements of the Mojave Desert. Nestled between the Nevada state line and Mojave National Preserve, the nearly 21,000 acres of Castle Mountains boasts Joshua tree forests, unbroken natural landscapes, rare desert grasslands, and rich human history. This intriguing area provides serenity and solitude from nearby metropolitan areas."
    },
    {name: "Death Valley", 
    image: "https://www.nps.gov/customcf/apps/CMS_HandF/ParkSearchPics/00542D46-FA04-DAE3-3B63820EE4116240.jpg",
    description: "In this below-sea-level basin, steady drought and record summer heat make Death Valley a land of extremes. Yet, each extreme has a striking contrast. Towering peaks are frosted with winter snow. Rare rainstorms bring vast fields of wildflowers. Lush oases harbor tiny fish and refuge for wildlife and humans. Despite its morbid name, a great diversity of life survives in Death Valley."
    }
    ]

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err,remove){
        if(err){
            console.log(err);
        } 
        //Function Callback when function is processed ok
        //To ensure add campgrounds is run AFTER the remove campgrounds
        //it must placed in the Callback, not just later in the function 

        console.log("All Removed"); 
        //Add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err,campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("Added a campground");
                    //Add a few comments
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
                  
            });
        });
    });
}

module.exports = seedDB;