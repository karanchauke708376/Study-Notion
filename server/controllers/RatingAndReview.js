const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { request, response } = require("express");
const { default: mongoose } = require("mongoose");


// Create-Rating-Review
const creatingRating = async (request , response) => {
 
    try{

        // get user id
        const userId = request.User.id;
       
        // fetch data from request body
        const {rating , review, courseId } = request.body;
       
        // check if user is enroll or not
        const courseDetails = await Course.findOne(   // searching criteria 
                                 {_id: courseId,      // $elementMatch : {eq: = equal}
                                  studentsEnrolled : {$elemMatch: {$eq : userId} } ,
                                 } );

        if(!courseDetails) {
            return response.status(404).json({
                success: false ,
                message: "Student is not enrolled in the course" ,
            });
        }
        
        // check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                    user: userId  ,
                                    course: courseId ,
        });
        if(alreadyReviewed) {
            return response.status(403).json({
                success: false ,
                message: "Course is already reviewed by the user" ,
            });
        }
      
        // create rating and review
        const ratingReviews = await RatingAndReview.create({
                                            rating , review ,
                                            course: courseId ,
                                            user : userId, 
        });
       
        // update course with this rating / review
        const updateCourseDetails =  await Course.findByIdAndUpdate({_id: courseId} , 
                                          {
                                            $push: {
                                                ratingAndReviews: ratingReviews._id ,
                                            }
                                        }, 
                                        {new: true});
                                        
        console.log(updateCourseDetails);
        // return response
        return response.status(200).json({
            success : true ,
            message: "Rating and Review create successfully" ,
            ratingReviews ,
        })

    }catch(error) {
        console.log(error);
        return response.status(500).json({
            success: false,
            message: error.message ,
        })
    }
}



// Get-Average-Ratting
const getAverageRating = async (request , response) => {
    try {

        // get course ID
        const courseId = request.body.courseId;
        
        // calculate avg ratting 
        const result = await RatingAndReview.aggregate([
            {
                // step 1
                $match:{    // course id string then convert object
                    course: new mongoose.Types.ObjectId(courseId) ,
                } ,
            }, 
            {
                // step 2
                $group: {   // all entry in single group wrap
                     _id:null ,
                     averageRating: { $avg: "$rating" }

                }

            }
        ])
             // Step 3
        // return ratting
        if(result.length > 0) {

            return response.status(200).json({
                success: true ,
                averageRating : result[0].averageRating,
            })
        }

        // if no rating / review exist 
        return response.status(200).json({
            success: true ,
            message: "Average Rating is 0 , no rating given till now" ,
            averageRating:  result[0].averageRating,
        })

    }catch(error) {
        console.log(error);
        return response.status(500).json({
            success: false ,
            message: error.message ,
        })

    }

}




// Get-All-Rating / Review 

const getAllRating = async (request , response ) => {
    try {

            const allReviews = await RatingAndReview.find({})
                                     .sort({rating: "desc"})
                                     .populate({
                                        path: "user" ,
                                        select: "firstName  lastName  email  image" ,
                                     })
                                     .populate({
                                        path:"Course" ,
                                        select: "courseName" ,
                                     })
                                     .exec();

        return response.status(200).json({
            success: true ,
            message: "All Review Fetched Successfully" ,
            data: allReviews ,
         });


    } catch(error) {
        console.log(error);
        return response.status(500).json({
            success: false ,
            message: error.message ,
        })
    }
}

module.exports = {
    creatingRating ,
    getAverageRating ,
    getAllRating 
}