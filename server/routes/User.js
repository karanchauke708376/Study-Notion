const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    signUp, 
    login , 
    changePassword ,
     sendOTP ,
     } = require("../controllers/Auth")
const {
    resetPasswordToken , 
    resetPassword , 
} = require("../controllers/ResetPassword")

const { auth } = require("../middleware/Auth")


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************


// Route for sending OTP to the user's email
router.post("/sendotp" , sendOTP)

// Route for user signup
router.post("/signup" , signUp)

// Route for user login
router.post("/login" , login)

// Route for Changing the password
router.post("/changePassword" , auth,  changePassword)


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************


// Route for generating a reset password token
router.post("/reset-password-token" , resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password" , resetPassword)

module.exports = router



