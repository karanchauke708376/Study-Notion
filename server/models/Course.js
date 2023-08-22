const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: { type: String } ,
    courseDescription: { type: String },
    instructor : {
        type: mongoose.Schema.Types.ObjectId,
        required: true ,
        ref: "user",
    },
    courseDescription: {
        type:String,
        required: true,
    },
    instructions: {
        type: [String],
    },

    whatYouWillLearn: {
        type: String ,
        required: true ,

    },
    courseContent: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Section" ,
        }
    ],
    ratingAndReviews: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview" ,
        }
    ],
    price: {
        type: Number ,
        required: true ,

    },
    thumbnail: {
        type: String ,
        required: true ,

    },
    tag: {
        type: [String],
        require: true ,
  
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId ,
            required: true,
            ref: "User", 
        }
    ],
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    createdAt: {
        type:Date ,
        default: Date.now ,
    },
});

module.exports = mongoose.model("Course" , courseSchema);