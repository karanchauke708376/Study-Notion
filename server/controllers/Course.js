const { request, response, json } = require("express");
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/SecToDuration")


// create Course Handler Function
const createCourse = async (request, response) => {

    console.log(request , " request :  ");

    try {

        const userId = request.User.id;

        // fetch data
        let { courseName , courseDescription , whatYouWillLearn, price  , category, tag , status , instructions } = request.body;

        // get thumbnail
        const thumbnail = request.files.thumbnailImage;

        //     // Convert the tag and instructions from stringified Array to Array
        // const tag = JSON.parse(_tag)
        // const instructions = JSON.parse(_instructions)

        // console.log("tag", tag)
        // console.log("instructions", instructions)

        // validation 
        if(
            !courseName || 
            !courseDescription || 
            !whatYouWillLearn || 
            !price || 
            !tag || 
            !thumbnail || 
            !category )

             {
            return response.status(400).json({
                success: false ,
                message: "All Field Are Mandatory" ,
            });
        }

        if (!status || status === undefined) {
			status = "Draft";
		}

        // check for instructor , id found 
        // const userId = request.User.id;
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });
        console.log("Instructor Details ", instructorDetails);
        // TODO verify that userId and InstructorDetails._id are same or not

        if(!instructorDetails) {
            return response(404).json({
                success: false ,      
                message: "Instructor Details Not Found"  , 
            });
        }

        // check given tag is valid or not
        const categoryDetails = await Category.findById(category);

        if(!categoryDetails) {
            return response.status(400).json({
                success: false , 
                message: "Category Details Not Found" ,  
            });
        }

        // Upload Images top cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail, 
            process.env.FOLDER_NAME
        );
        console.log(thumbnailImage);


        // create an entry new course 
        const newCourse = await Course.create({
            courseName , 
            courseDescription ,
            instructor: instructorDetails._id ,
			whatYouWillLearn: whatYouWillLearn,
            price ,
            status: status ,
            tag:tag ,
			category: categoryDetails._id,
            thumbnail : thumbnailImage.secure_url ,
            instructions : instructions ,

        })

        // add the new course to the  user schema of instructor 
        await User.findByIdAndUpdate(   // user find
            {
                 _id: instructorDetails._id ,
            } ,
            { 
                $push : {      // new course ki id store
                    Courses : newCourse._id ,
                },
            },
            {new:true}, // update response
        );

        // update the Tag ka Schema 
        await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);

        // return response
        response.status(200).json({
            success: true ,
            data: newCourse,
            message : "Course Created Successfully" ,
        });
    }
    catch(error) {
        console.error(error);
        return response.status(500).json({
            success: false , 
            message: "Failed to create Course",
            error: error.message ,
        })
    }
};

    // Edit Course Details
    const editCourse = async(request , response) => {
        try {
            const { courseId } = request.body;
            const updates = request.body;
            const course = await Course.findById(courseId);
            
            if(!course) {
                return response.status(404).json(
                    {
                        error: "Course Not Found"
                    })
            }

            // if Thumbnail Image is found , update it

            if(request.files) {
                console.log("Thumbnail Update");
                const thumbnail = request.files.thumbnailImage;
                const thumbnailImage = await uploadImageToCloudinary(
                thumbnail ,
                process.env.FOLDER_NAME
                )
                course.thumbnail = thumbnailImage.secure_url;            
            }

            // update only the field that are present in the request body

            for(const key in updates) {
                if(updates.hasOwnProperty(key)) {
                    if(key === "tag" || key === "instructions") {
                        course[key] = JSON.parse(updates[key])
                    } else {
                        course[key] = updates[key]
                    }
                }
            }

            await course.save();

            const updateCourse = await Course.findOne({
                _id: courseId,
            })

            .populate({
                path: "instructor" ,
                populate : {
                    path: "additionalDetails" ,
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

            response.json({
                success : true , 
                message : "Course Updated Successfully",
                data : updateCourse ,
            })
        } catch(error) {
            console.error(error);
            response.status(500).json({
                success : false ,
                message : "Internal server error",
                error:error.message ,
            })
        }
    }





    // getAll Course Handler function
    const getAllCourses = async (request , response) => {
        try {
            
            // change functin after few days
            const allCourses = await Course.find({} , {
                                                       courseName :true ,
                                                       price:true ,
                                                       thumnail: true ,
                                                       instructor : true , 
                                                       ratingAndReviews : true ,
                                                       studentsEnrolled : true ,
                                                    }
                                                )
                                                       .populate("nstructor")
                                                       .exec();
            return response.status(200).json({
                success : true ,
                message: "Data For All Courses Fetched Successfully " ,
                data : allCourses ,
            })
        }
        catch(error) {
            console.log(error);
            return response.status(500).json({
                success: false ,
                message: "Cannot Fetch Course Data" ,
                error: error.message ,
            });
        }
        
    };

    // // getCourseDetails
    // function convertSecondsToDuration(time){
    //      let min = time/60 > 1 ? time/60 : 0 ;
    //       let sec = time%60 > 1 ? time%60 : time;
    //        let hour = min/60 > 1 ? min/60 : 0 ;
    //         min = min%60;
    //         return `${hour}h:${min}m:${sec}s`;
    // }

const getCourseDetails = async (request, response) => {
    try{

        // get id / fetch id
        const {courseId} = request.body;

        // find course details
        const courseDetails = await Course.findOne(
                                  {_id : courseId})
                                  .populate(
                                    {
                                         path: "instructor" ,
                                        populate: {
                                            path:"additionalDetails" ,
                                        },
                                    }
                                  )
                                  .populate("category")  // temp comment for testing only below code
                                  .populate("ratingAndReviews")
                                  .populate({
                                    path:"courseContent",
                                    populate: {
                                        path: "subSection" ,
                                        select : "-videoUrl",
                                    },
                                  }
                                ) 
                                .exec();
            // validation
            if(!courseDetails) {
                return response.status(400).json({
                    success: false ,
                    message: `Could not found the course with ${courseId}` ,
                });
            }

            let totalDurationInSeconds = 0
            courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return response.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    })
  }
} 
   

        


const getFullCourseDetails = async (request , response) => {
    try {
            const {courseId} = request.body
            const userId = request.User.id
            const courseDetails = await Course.findOne({
                _id : courseId ,
            })
            .populate({
                path: "instructor" ,
                populate : {
                    path : "additionalDetails" ,
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent" ,
                populate : {
                    path : "subSection",
                }
            })
            .exec()

            let courseProgressCount = await CourseProgress.findOne({
                courseId : courseId ,
                userId : userId
            })

            console.log("CourseProgressCount : " , courseProgressCount);

            if(!courseDetails) {
                return response.status(400).json({
                    success : false , 
                    message : `Could not find course with id : ${courseId}` , 
                })
            }

            let totalDurationInSeconds = 0 ;
            courseDetails.courseContent.forEach((content) => {
                content.subSection.forEach((subSection) => {
                    const timeDurationInSeconds = parseInt(subSection.timeDuration)
                    totalDurationInSeconds += timeDurationInSeconds
                })
            })

            const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

            return response.status(200).json({
                success : true ,
                data : {
                    courseDetails , 
                    // totalDuration ,
                    completedVideos : 
                    courseProgressCount?.completedVideos 
                    ? courseProgressCount?. completedVideos
                    : [] ,
                },
            })
        } catch (error) {
                return response.status(500).json({
                    success : false ,
                    message : error.message ,

                })
            }
}

// get a list of course for a given Instructor

const getInstructorCourses = async (request , response) => {
    try {
        // get the instructor ID from the authenticated user or request body
        const instructorId = request.User.id

        // find all courses belonging to the instructor
        const instructorCourses = await Course.find({
            instructor : instructorId ,
        }).sort({ createAt : -1 }).populate({
             path:"courseContent",
                populate:{
                    path:"subSection"
                }
             
        })//voice aa rahi meri

        // Return the instructor's courses
        response.status(200).json({
            success : true ,
            data : instructorCourses ,
        })
    } catch(error) {
        console.log(error);
        response.status(500).json({
            success : false,
            message : "Failed to retrieve instructor course" ,
            message : error.message ,
        })
    }
}

const deleteCourse = async (request, response) => {
    try {
      const { courseId } = request.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await subSections.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return response.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }




module.exports = {
    createCourse ,
    editCourse ,
    getAllCourses ,
    getCourseDetails  ,
    getInstructorCourses ,
    deleteCourse,
    getFullCourseDetails

}