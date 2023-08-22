
const Category = require("../models/Category");

// create Tag ka handler function
const createCategory = async (request, response) => {
    try {

        // fetch data from body
        const {name , description} = request.body;

        // validation
        if(!name || !description) {
            return response.status(400).json({
                success: false ,
                message: "All Fields Are Required! " ,

            });
        }
        // create entry in database
        const CategorysDetails = await Category.create({
            name: name ,
            description: description ,
        });
        console.log(CategorysDetails);
        
        // response
        return response.status(200).json({
            success: true ,
            message: "Tag Create Successfully",
        })

    }catch(error){
        return response.status(500).json({
            success: false ,
            message: error.message ,
        })
    }  
};

 // get All Categories
 const showAllCategories = async (request, response) => {
    try {
        const allCategorys = await Category.find({});
        response.status(200).json({
            success: true ,
            message: "All Tags Return Successfully" ,
            data:allCategorys,
        })

    }
    catch(error) {
        return response.status(500).json({
            success: false ,
            message: error.message ,
        })
    }
 };


 // categoryPageDetails
//  const categoryPageDetails = async (request , response) => {

//     try {
//         // get categoryId
//         const {categoryId} = request.body;

//         // get courses for specified category
//         const selectedCategory = await Category.findById(categoryId)
//                                             .populate("course")
//                                             .exec();

//         // validation
//         if(!selectedCategory) {
//             return response.status(404).json({
//                 success: false ,
//                 message: "Date Not Found!",
//             });
//         }


//         // get course for different category
//         const differentCategories = await Category.find({
//                                             // ne = not equal
//                                         _id: {$ne: categoryId},
//                                     }) 
//                                     .populate("courses")
//                                     .exec(); 




//         // get top selling      
//         // top 10 selling course
//         // Homework to selling course

//         // return response 
//         return response.status(200).json({
//             success: true ,
//             data: {
//                 selectedCategory ,
//                 differentCategories ,
//                 // sellingCourse ,
//             },
//         });

//     }catch(error) {
//         console.log(error);
//         return response.status(500).json({
//             success: false ,
//             message:error.message ,
//         });

//     }
//  }

function getRandomInt(value){
   return Math.floor(Math.random()*value);
}

const categoryPageDetails = async (request, response) => {
    try {
      const { categoryId } = request.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {path:"ratingAndReviews"},
        })
        .exec()
        console.log("selected",selectedCategory)
  
      //console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return response
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory?.courses?.length === 0) {
        console.log("No courses found for the selected category.")
        return response.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected?.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
        console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      response.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

 module.exports = {
    createCategory ,
    showAllCategories ,
    categoryPageDetails 
 }
