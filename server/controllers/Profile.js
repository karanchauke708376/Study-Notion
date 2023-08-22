const { request, response } = require("express");
const { json } = require("express");
const Course = require("../models/Course");
const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const { convertSecondsToDuration } = require("../utils/SecToDuration")



const updateProfile = async (request, response) => {
	try {
		const { dateOfBirth="" , about="" , contactNumber } = request.body;
		const id = request.User.id;
    // console.log(request.body);

		// Find the profile by id
		const userDetails = await User.findById(id);
    console.log(userDetails.additionalDetails._id);
		const profile = await Profile.findById(userDetails.additionalDetails);

    console.log(profile , "profil 1 -- > ");

		// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;

    console.log(profile , "profile  2 -- > ");

    

		// Save the updated profile
		await profile.save();
  const user =  await User.findById(id).populate("additionalDetails");
		return response.json({
			success: true,
			message: "Profile updated successfully",
      updatedUserDetails:user,
		});
	} catch (error) {
		console.log(error);
		return response.status(500).json({
			success: false,
			error: error.message,
		});
	}
};


// delete account
const deleteAccount = async(request , response) => {

    try {
        // get id
        console.log("Printing Id : " + request.User.id);
        const id = request.User.id;

        // validation
        const user = await User.findById({_id: id});
        if(!user) {
            return response.status(404).json({
                success: false ,
                message: "User Not Found!" ,
            });
        }

        // delete profile
        await Profile.findByIdAndDelete({_id: user.additionalDetails});
       
  
        // TODO: HW unenroll user form all enrolled courses
        // delete user
        await User.findByIdAndDelete({_id: id});


        // return response 
            response.status(200).json({
            success: true ,
            message: "User Account Delete Successfully" ,
        })

    }catch(error) {
        return response.status(400).json({
            success: false ,
            message: "User cannot be delete successfully" ,
        })
    }
}

    // User All Details Fetch
    const getAllUserDetails = async(request, response) => {

        try {
            // get id / fetch id
            const id = request.User.id;

            // get/fetch user details
            const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();
            console.log(userDetails);

            // return response
            return response.status(200).json({
                success: true ,
                message:"User Data Fetched Successfully" ,
                data:userDetails,

            })
        }catch(error) {
            return response.status(500).json({
                success: false , 
                message:error.message ,
            });
            
        }
    }

    
const updateDisplayPicture = async (request, response) => {
    try {
      const displayPicture = request.files.displayPicture;
      const userId = request.User.id;
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true },
      )
      response.status(200).json({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      });
    } catch (error) {
      console.log("Somwthing Wrong !");
      console.log(error);
      return response.status(500).json({
        success: false,
        message:"Something Wrong!",
        message: error.message,
      });
    }
};

const getEnrolledCourses = async (request, response) => {
    try {
      const userId = request.User.id;
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            } ,
          },
        })
        .exec()

        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
          )
          SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
        }
        }



      if (!userDetails) {
        return response.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return response.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

const instructorDashboard = async (request , response) => {
  try {

    const courseDetails = await Course.find({ instructor :request.User.id});

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // create an new object with the additional fields
      const courseDataWithStats = {

        _id : course._id ,
        courseName : course.courseName ,
        courseDescription : course.courseDescription ,
        totalStudentsEnrolled ,
        totalAmountGenerated ,
      }

      return courseDataWithStats

    })

      response.status(200).json({ courses : courseData });

  } catch(error) {
    console.log(error);
    response.status(500).json({
      message : "Internal Server Error"
    })
  }
}

module.exports = { 
  updateProfile , 
  deleteAccount ,
  getAllUserDetails ,
  updateDisplayPicture ,
  getEnrolledCourses ,
  instructorDashboard ,

}