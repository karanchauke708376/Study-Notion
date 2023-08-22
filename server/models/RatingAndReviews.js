const mongoose = require("mongoose");
const Course = require("./Course");

const ratingAndReviewsSchema = new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId ,
    required: true,
    ref : "user" ,
},
rating: {
    type: Number ,
    required: true ,
},
review: {
    type:String,
    required: true ,
},
Course: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Course" ,
    index: true ,
},

});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewsSchema); 