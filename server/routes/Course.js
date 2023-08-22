const express = require("express")
const router = express.Router()

// Import the Controllers
// all handler lekar aunga controller mai se
const {createCategory , showAllCategories , categoryPageDetails }  = require("../controllers/Category")
const {createCourse , getCourseDetails , getAllCourses,editCourse ,getInstructorCourses,getFullCourseDetails , deleteCourse } = require("../controllers/Course")
const {creatingRating ,getAverageRating , getAllRating } = require("../controllers/RatingAndReview")
const {createSection , updateSection , deleteSection } = require("../controllers/Section")
const {createSubSection , updateSubSection , deleteSubSection } = require("../controllers/SubSection")
const {updateCourseProgress } = require("../controllers/courseProgress");

// importing middlewares
const  {auth , isInstructor , isStudent , isAdmin } = require("../middleware/Auth")

// api route --> method ? Path ? which route link ?

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails",  getCourseDetails)

router.post("/editCourse", auth, isInstructor, editCourse)

router.delete("/deleteCourse", deleteCourse)

router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses)

router.post("/getFullCourseDetails",auth,isStudent,getFullCourseDetails)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here     
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/editCourse",auth,isInstructor,editCourse);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, creatingRating)
router.get("/getAverageRating", getAverageRating) 
router.get("/getReviews", getAllRating)


module.exports = router


