const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");


exports.updateCourseProgress = async(request,response) => {
    const {courseId, subSectionId} = request.body;
    const userId = request.User.id;

    try{
        //check if the subsection is valid
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection) {
            return response.status(404).json({error:"Invalid SubSection"});
        }

        console.log("SubSection Validation Done");

        //check for old entry 
        let courseProgress = await CourseProgress.findOne({
            courseID:courseId,
            userId:userId,
        });
        if(!courseProgress) {
            return response.status(404).json({
                success:false,
                message:"Course Progress does not exist"
            });
        }
        else {
            console.log("Course Progress Validation Done");
            //check for re-completing video/subsection
            if(courseProgress.completedVideos.includes(subSectionId)) {
                return response.status(400).json({
                    error:"Subsection already completed",
                });
            }

            //push into completed video
            courseProgress.completedVideos.push(subSectionId);
            console.log("Copurse Progress Push Done");
        }
        await courseProgress.save();
        console.log("Course Progress Save call Done");
        return response.status(200).json({
            success:true,
            message:"Course Progress Updated Successfully",
        })
    }
    catch(error) {
        console.error(error);
        return response.status(400).json({error:"Internal Server Error"});
    }
}