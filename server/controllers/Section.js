const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection"); // course update
// Create Section
// Update Section
// Delete Section

// Create Section
const createSection = async (request, response) => {
  try {
    // data fetch
    const { sectionName, courseId } = request.body;
    console.log(request.body);

    // data validation
    if (!sectionName || !courseId) {
      return response.status(400).json({
        success: false,
        message: "Missing Required Properties",
      });
    }

    // create section
    const newSection = await Section.create({ sectionName });

    // update course with section objectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ) /*// home work kiya h confirm please right or wrong
                                        .populate("newSection")
                                        // .populate("subsection") 
                                        .exec(); */
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Use Populate to replace section / subsections both in the updateCourseDetail                                )
    // return response
    return response.status(200).json({
      success: true,
      message: "Section Created Successfully ",
      updatedCourseDetails,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Unable to create Section , please try again",
      error: error.message,
    });
  }
};

// Update Section
const updateSection = async (request, response) => {
  // data fetch
  try {
    const { sectionName, sectionId, courseId } = request.body;
    console.log("req body", request.body);
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent", // section-name
        populate: {
          path: "subSection", // sub-section-name
        },
      })
      .exec();

    response.status(200).json({
      success: true,
      message: section,
      data: course,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteSection = async (request, response) => {
  try {
    console.log("Request Body . . .", request.body);
    const { sectionId, courseId } = request.body;

    const section = await Section.findById(sectionId);
    for (let x of section?.subSection) 
       await SubSection?.findByIdAndDelete(x);
    const sectionDelete = await Section.findByIdAndDelete(sectionId);
    if (!sectionDelete) {
      return response.status(500).json({
        success: false,
        message: "error in section finding",
      });
    }

    const course = await Course.findByIdAndUpdate(courseId,{
         $pull:{
            courseContent:section._id
         }
    },{new:true})
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        }
      })
      .exec();

    if (!course) {
      return response.status(500).json({
        success: false,
        message: "error in course finding",
      });
    }
    console.log("course response", course);

    return response.status(200).json({
      success: true,
      data: course,
      message: "Section Delete Successfully . . .",
    });
  } catch (error) {
    console.error("Error Section Deletion . . . ", error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

// // Delete Section , course update not code
// const deleteSection = async (request, response) => {
// 	try {
// 		//HW -> req.params -> t
//         console.log("req body",request.body);
//         console.log("Delete Ho Raha Hai Kya ?");
//         // parameter k ander section aayega
//         // body k ander section aayega
// 		const { sectionId ,courseid} = request.body;
// 		await Section.findByIdAndDelete(sectionId);
// 		const updatedCourse=Course.findById(courseid)
// 		response.status(200).json({
// 			success: true,
//             data:updatedCourse,
// 			message: "Section Deleted Successfully",
// 		});
// 	} catch (error) {
// 		console.error("Error deleting section:", error);
// 		response.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 		});
// 	}
// };

module.exports = {
  createSection,
  updateSection,
  deleteSection,
};
