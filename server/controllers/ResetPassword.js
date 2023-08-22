
const { request, response } = require("express");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const resetPasswordToken = async(request, response) => {

   try {

        // get email from request body , different way fetch email
        const email = request.body.email; 

        // check user for this email , email validation
        const user = await User.findOne({email: email});
        // not user find 
        if(!user) {
            return response.json({
                success: false ,
                message: `Your Email : ${email} Is not registered with Us Enter a Valid Email `,
            });
        }
    
        // generation token 
        // const token = crypto.randomUUID();

        const token = crypto.randomBytes(20).toString("hex");
    
        // update user by addition token and expiration time 
        // email k adhar par search karna 
        const updateDetails = await User.findOneAndUpdate(
                                        { email: email } ,
                                        {       //add token value change
                                            token: token ,   // add expired   // 5 min time expire link
                                            resetPasswordExpires: Date.now() + 3600000,
                                        }, 
                                            // updated documents return
                                        {new: true}
        );

        console.log("Details : " , updateDetails);
    
        // create url  ,  fronted localhost 3000 , frontend send body url
        const url = `http://localhost:3000/update-password/${token}`;
    
        // send mail containing the url
        await mailSender(email, "Password Reset Link " , 
                               `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );
        // return response 
         response.json({
            success: true , 
            message: "Email send successfully, please check email and change password" ,
        });
 
    } catch(error) {
        console.log(error);
        return response.status(500).json({
            success: false,
            message: "Something went wrong while sending reset password mail"
        });
   }

};

// - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - 

// reset passord
    
    const resetPassword = async(request, response) => {
       
      try{

          // data fetch
          const {password , confirmPassword , token} = request.body;

          // validation
          if(confirmPassword !== password) {
                return response.json({
                  success: false ,
                  message: "Password and Confirm Password Does not Match",
                });
          }
  
          // get user details from database using token
         const userDetails = await User.findOne({token: token});
  
          // if no entry - invalid token
          if(!userDetails) {
              return response.json({
                  success: false ,
                  message: "Token Is Invalid" ,
              });
          }
         
          // token time check
          console.log(userDetails);
          if((!userDetails.resetPasswordExpire > Date.now())) {
              return response.status(403).json({
                  success: false, 
                  message: `Token Is Expired , please re-generete your token` ,
              });

          } 
         
          // hash password
          const encryptedPassword = await bcrypt.hash(password, 10);
       
          // update password 
          await User.findOneAndUpdate(
              {token: token},
              {password: encryptedPassword},
              {new: true}
          );
        
          // return response
          response.status(200).json({
              success:true,
              message: " Password Reset Successfully " ,
          })

        }catch(error){
            console.log(error);
            return response.status(500).json({
                success: false,
                message: "Something went wrong while sending reset password mail"
            });

        }
    }
   
    module.exports = {
        resetPasswordToken ,
        resetPassword 

    } 
