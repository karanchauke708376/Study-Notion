const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const { request, response } = require("express");

// Auth
exports.auth = async (request, response, next) => {
    try {
        //extract token
        // 3 way find token , safe token is header , weak token is body
        const token = request.cookies.token 
                ||    request.body.token 
                ||    request.header("Authorization").replace("Bearer ", "");

        // if token missing , then return response
        if(!token) {
            return response.status(401).json({
                success: false,
                message: 'Token Is Missing' ,
            });
        }

        // verified the token
        try {
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            // user add id 
            request.User = decode;

        }catch(err) {
            // verification issue 
            return response.status(401).json({
                success: false ,
                message: "token is invalid",  
            });
        }
        next();  // next middleware jump 

    }catch(error){
        return response.status(401).json({
            success: false , 
            message: "Something went wrong while validating the token",
        });
    }
}

// isStudent
exports.isStudent = async(request , response , next) => {
    try{
        if(request.User.accountType !== "Student") {
            return response.status(401).json({
                success: false ,
                message: "This is a protected route for the students only"
            })
        }
        next();

    }catch(error) {
        response.status(500).json({
            success: false, 
            message: "User role cannot be varified , please try again" 
        });
    }
}

// isInstructor
exports.isInstructor = async(request , response , next) => {
    try{
        if(request.User.accountType !== "Instructor") {
            return response.status(401).json({
                success: false ,
                message: "This is a protected route for the isInstructor only"
            })
        } 
        next();

    }catch(error) {
        response.status(500).json({
            success: false, 
            message: "User role cannot be varified , please try again" 
        });
    }
}

// isAdmin
exports.isAdmin = async(request , response , next) => {
    try{
        console.log("Printing AccountType " , request.User.accountType);
        if(request.User.accountType !== "Admin") {
            return response.status(401).json({
                success: false ,
                message: "This is a protected route for the isAdmin only"
            })
        }
        next();

    }catch(error) {
        response.status(500).json({
            success: false, 
            message: "User role cannot be varified , please try again" 
        });
    }
}

