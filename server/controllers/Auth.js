const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const { request, response } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const info = require('../utils/mailSender');
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

   // Sendotp
   const sendOTP = async (request, response) => {

      try {

         // fetch email from request ki body
      const {email} = request.body;

      // check if user already exist
      const checkUserPresent = await User.findOne({email});

      //if user already exist, then return a response
      if(checkUserPresent) {
         return response.status(401).json({
            success: false ,
            message: `User Is Already Registered!` ,
         });
      }

      // generate OTP 6 is letter size
      var otp = otpGenerator.generate(6, {
         upperCaseAlphabets: false ,
         lowerCaseAlphabets: false ,
         specialChars: false ,
      });

            // Unique Find OTP Or Not
      const result = await OTP.findOne({otp: otp});
      console.log("Result is Generate OTP Func");
      console.log("OTP Generated : " , otp); 
      console.log("OTP", otp);
		console.log("Result", result);

      while(result) {
         otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false ,
            lowerCaseAlphabets: false ,
            specialChars: false ,
         });
      }

       // payload create and insert database
      const otpPayload = {email, otp};

      // create an entry DB for OTP
      const otpBody = await OTP.create(otpPayload);
      console.log("OTP Body " , otpBody);


      // return response successful
      response.status(200).json({
         success: true,
         meassage: `OTP Sent Successfully`,
         otp,
      });

      }catch(error) {

         console.log(error.meassage);
         return response.status(500).json({
            success: false,
            meassage: error.meassage,
         });
      }
   };

//  -  -  -  -   -   -    -    -   -    -   -     -   -

  // signup
   const signUp = async (request, response) => {

     try {

         // data fetch from request ki body
         // missing 1- confirmPassword 2- phoneNumber User.js
         const {
            firstName ,
            lastName ,
            email ,
            password ,
            confirmPassword ,
            accountType ,
            contactNumber ,
            otp ,
         } = request.body;

         // validate karlo
         if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return response.status(403).json({
               success: false ,
               messsage : "All fields are required",
            })
         }
         // 2 password match karlo
         if(password !== confirmPassword) {
            return response.status(400).json({
               success: false ,
               meassage: "Password and ConfirmPassword Value Does Not Match , Please Try Again !"
            });
         }

         // check user already exist or not
         const existingUser = await User.findOne({email});
         if(existingUser) {
            return response.status(400).json({
               success: false ,
               meassage: "User Is Already Registered" ,
            });
         }

         // find most recent stored for the user , refresh otp
         const recentOtp = await OTP.find({email}).sort({createAt:-1}).limit(1);
         console.log(recentOtp);
         
         // validate OTP
         if(recentOtp.length === 0) {
            // OTP not found
            return response.status(400).json({
               success: false ,
               meassage: "OTP Is Not Found "
            });
         } else if(otp !== recentOtp[0].otp) {
            //Invalid OTP
            return response.status(404).json({
               success: false,
               meassage: "OPT Is Invalid Enter! , try again properly",
            })
         }

         // Hash password
         const hashedPassword = await bcrypt.hash(password, 10);
         
         //entry create in DB
         // Create the user
         let approved = "";
         approved === "Instructor" ? (approved = false) : (approved = true);

         // Profile Datails
         const profileDetails = await Profile.create({
            gender: null ,
            dateOfBirth: null ,
            about: null,
            contactNumber: null,
         });

            // user entry save
         const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password : hashedPassword ,
            accountType : accountType ,
            approved: approved ,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}` ,
         })

         // return res
         return response.status(200).json({
            success: true ,
            message: 'User Is Registered Successfully',
            user,
         });

     }catch(error) {
      console.error(error);
      response.status(500).json({
         success: false ,
         message: "User Cannot Be Registered, Please Try Again . . ." ,
      })

     }
 
   }

//  -  -  -  -   -   -    -    -   -    -   -     -   -
      // login
   const login = async (request, response) => {
      
      try {
            // get data from request body
            const {email , password } = request.body;

            // validation data
            if(!email || !password) {
               return response.status(403).json({
                  success:false,
                  message: "All fields are required! , Please try again",
               });
            }

            // user check exist or not 
            const user = await User.findOne({email}).populate("additionalDetails");
            if(!user) {
               return response.status(401).json({
                  success: false,
                  message: "User is not registered , please signup first " , 
               });
            }

            // password verify 
            if(await bcrypt.compare(password, user.password)) {
                  const payload = {
                  email: user.email , 
                  id: user._id ,
                  accountType: user.accountType,
               }

               // generate JWT Token
               const token = jwt.sign(payload , process.env.JWT_SECRET , {
                  expiresIn: "2h" ,
               });
               
              /* // Generate JWT token and Compare Password
               if (await bcrypt.compare(password, user.password)) {
                  const token = jwt.sign(
                     { email: user.email, id: user._id, accountType: user.accountType },
                     process.env.JWT_SECRET,
                     {
                        expiresIn: "24h",
                     }
                  );  */


               user.token = token;
               user.password = undefined;

               // create cookie and send response
               const options = {
                  expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                  httpOnly: true,
               }
            
               response.cookie("token" , token , options).status(200).json({
                  success: true ,
                  token, 
                  user,
                  message: "Logged in successfully" ,
               });

            } 
            else {
               return response.status(401).json({
               success: false ,
               message: 'Password is incorrect',
             });
            }
      
         }catch(error) {

            console.log(error);
            return response.status(500).json({
            success: false,
            message: "Login Failure , please try again" ,
         })

      } 
         
   };

//  -  -  -  -   -   -    -    -   -    -   -     -   -
  // changepassword 

const changePassword = async(req, response) => {
      try {
         // Get user data from req.user
         const userDetails = await User.findById(req.User.id);
   
         // Get old password, new password, and confirm new password from req.body
         const { oldPassword, newPassword, confirmNewPassword } = req.body;
   
         // Validate old password
         const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
         );
         if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return response
               .status(401)
               .json({ success: false, message: "The password is incorrect" });
         }
   
         // Match new password and confirm new password
         if (newPassword !== confirmNewPassword) {
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
            return response.status(400).json({
               success: false,
               message: "The password and confirm password does not match",
            });
         }
   
         // Update password
         const encryptedPassword = await bcrypt.hash(newPassword, 10);
         const updatedUserDetails = await User.findByIdAndUpdate(
            req.User.id,
            { password: encryptedPassword },
            { new: true }
         );
   
         // Send notification email
         try {
            const emailResponse = await mailSender(
               updatedUserDetails.email,
               passwordUpdated(
                  updatedUserDetails.email,
                  `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
               )
            );
            console.log("Email sent successfully:", emailResponse.response);
         } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return response.status(500).json({
               success: false,
               message: "Error occurred while sending email",
               error: error.message,
            });
         }
   
         // Return success response
         return response
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
      } catch (error) {
         // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
         console.error("Error occurred while updating password:", error);
         return response.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
         });
      }
};

module.exports = {
   sendOTP , 
   login ,
   signUp ,
   changePassword

}