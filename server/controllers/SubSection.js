const SubSection = require("../models/SubSection");
const Section = require("../models/Section");  // for id insert to need insert section
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { findById } = require("../models/Course");


// create SubSection
const createSubSection = async (request, response) => {
    try {

           // fetch data from request body
           // sectionId - >  khud se send kiya h
           const {sectionId , title , description } = request.body;
          
           // extraction file
           const video = request.files.videoFile;
           console.log("dta",request.body);
           //  validation
           if(!sectionId || !title || !description || !video) {
            return response.status(400).json({
                success: false ,
                message: "All Field Are Required" ,
              })
           }
           console.log(video)
       
           //  upload video to cloudinary & find secure url
           const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);

           // create a sub-section
             const subSectionDetails = await SubSection.create({
                title: title ,
                timeDuration: `${uploadDetails.duration}` ,
                description: description ,
                videoUrl: uploadDetails.secure_url , 
             })
       
           // update section with this sub section OjectedId
           const updatedSection = await Section.findByIdAndUpdate({_id:sectionId } , // search by sectionId entry
                                                    {$push:{                          // push data 
                                                        subSection:subSectionDetails._id ,
                                                    }},
                                                    {new: true} )
                                                    // .populate("updatedSection")
                                                    .populate("subSection")
            console.log(updatedSection);
            // Homework - log update section here , after adding populate query

           // return response
           return response.status(200).json({
            success: true ,
            message: "Sub-Section Create Successfully" ,
            data: updatedSection ,
           })
    
    }catch(error) {
            console.error("Error creating new sub-section:", error);
            response.status(500).json({
            success: false ,
            message: "Internal Server Error" ,
            error:error.message ,
        })
    }
};



//  homework - updated SubSection
const updateSubSection = async (request, response) => {
    try {
      const { sectionId, subSectionId , title, description } = request.body
      const subSection = await SubSection.findById(subSectionId)
      console.log(request.body);
  
      if (!subSection) {
        return response.status(404).json({
          success: false,
          message: "Sub-Section not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (request.files && request.files.video !== undefined) {
        const video = request.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return response.json({
        success: true,
        data : updatedSection ,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }



//  homework - delete SubSection 
const deleteSubSection = async (request, response) => {
    try {
      const { subSectionId, sectionId } = request.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete(subSectionId)
  
      if (!subSection) {
        return response
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return response.json({
        success: true,
        data : updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }


  module.exports = { 
    createSubSection ,
    updateSubSection ,
    deleteSubSection 

  }