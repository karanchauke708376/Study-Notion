const {instance} = require("../config/razorpaydb");
const Course = require("../models/Course");
const User = require("../models/User");
const mailsender = require("../utils/mailSender");
const CourseProgress = require("../models/CourseProgress")
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail"); // import file email/templete
const { default: mongoose } = require("mongoose");
const { request, response } = require("express");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");

    // Single Course Buy Payment API

//catpture the payment initiate the Razorpay order
// const capturePayment = async (request , response) => {

//     // get courseId , UserId
//     const {course_id} = request.body;
//     const userId = request.User.id
    
//     // validation
//     // valid courseId
//     if(!course_id) {
//         return response.json({
//             success: false ,
//             message: "Please provide valid course ID" , 
//         })
//     };

//     // valid courseDetail
//     let course;
//     try {
//         course = await Course.findById(course_id);
//         if(!course) {
//             return response.json({
//                 success: false ,
//                 message: "Could not find the course" ,
//             });
//         }

//         // user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId); // string to object id conversion
//         if(course.studentsEnrolled.includes(uid)) {
//             return response.status(200).json({
//                 success:false ,
//                 message: "Student is already enrolled" ,
//             })
//         }
//     }catch(error) {
//         console.error(error);
//         return response.status(500).json({
//             sucess: false ,
//             message:error.message ,
//         })
//     }

//     // order create
//     const amount = course.price;
//     const currency = "INR";
    
//     const options = {
//         amount: amount * 100 ,
//         currency ,
//         receipt: Math.random(Date.now()).toString() , // unique find receipt id help date , string
//         notes: {
//             courseId: course_id ,
//             userId,
//         }
//     };

//     // function call 
//     try {
//         // initiate the payment using razorpay 
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         // return response
//         return response.status(200).json({
//             sucess: true ,
//             courseName : course.courseName ,
//             courseDescription : course.courseDescription ,
//             thumbnail : course.thumbnail,
//             orderId : paymentResponse.id ,
//             currency : paymentResponse.currency ,
//             amount : paymentResponse.amount ,
//         });
        
//     }catch(error) {
//         console.log(error);
//         response.json({
//             success: false ,
//             message: "Could not initiate order" ,
//         });
//     }
// }

// // Verified Signature Of Razorpay and Server
 
// const verifySignature = async (request , response) => {

//     const webhookSecret = "12345678";   // signature 1
//     const signature = request.headers["x-razorpay-signature"];  // signature 2

//     // Step - 1
//     const shasum = crypto.createHmac("sha256", webhookSecret); 
//     // Step - 2
//     shasum.update(JSON.stringify(request.body)); 
//     // Step - 3
//     const digest = shasum.digest("hex"); 

//     if(signature == digest) {
//         console.log("Payment Is Authorised . . . ");

//         const {courseId , userId } = request.body.payload.entity.notes;
        
//         try {
//                 // fulfill the action

//                 // find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id: courseId} ,
//                                                 {$push: {studentsEnrolled: userId}} ,
//                                                 {new: true} ,
                                            
//                 );

//                 if(enrolledCourse) {
//                     return response.status(500).json({
//                         success: false ,
//                         message: "Course Not Found!"
//                     });
//                 }
//                 console.log(enrolledCourse);

//                 // find the student and add the course to list of enrolled courses me
//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id : userId }   ,
//                                                 { $push: {courses:courseId}} ,
//                                                 {new : true} ,  
//                 ); 

//                 console.log(enrolledStudent);

//                 // mail send kardo confirmation wala
//                 const emailResponse = await mailsender(
//                                         enrolledStudent.email ,
//                                         "Congratulations From Codehelp . . . ",
//                                         "Congratulations , you are onboarded into new Codehelp Course" ,

//                 );
//                 console.log(emailResponse);
//                 return response.status(200).json({
//                     success: true ,
//                     message: "Signature Verified and Course Added" ,
//                 });


//         }catch(error) {
//             console.log(error);
//             return response.status(500).json({
//                 success: false ,
//                 message:error.message ,
//             });
//         }
//     } else {

//         return response.status(400).json({
//             success: false ,
//             message: "Invalid Request!" ,
//         });
         
//     }
// }

// module.exports = { 
//     capturePayment, 
//     verifySignature
// }


        // Single & Multiple Course Buy Payment New API

    // Initiate the razorpay order
    exports.capturePayment = async(request , response) => {

        const {courses} = request.body;  // courses id fetch
        const userId = request.User.id;  // user id find

        if(courses.length === 0) {
            return response.json({success: false , message : 'Please Provide Course Id'});
        }

        let totalAmount = 0;

        // traversal of all courses total amount 
        for(const course_id of courses) {
            let course;

            try {  // course find data
                course = await Course.findById(course_id);
                if(!course) {
                    return response.status(200).json({success: false , message : "Could not find the course"});
                }

                // UID Create Student
                const uid = new mongoose.Types.ObjectId(userId);
                if(course.studentsEnrolled.includes(uid)) {
                    return response.status(200).json({success: false , message : "Student is already Enrolled"});
                }

                totalAmount += course.price;

            }
            catch(error) {
                console.log(error);
                return response.status(500).json({success : false , message: error.message})
            }
        }

        // options create
        const options = {
            amount : totalAmount * 100 ,
            currency : "INR" ,
            receipt : Math.random(Date.now()).toString(),
        }

        // Order Created before you have option created
        try {
            const paymentResponse = await instance.orders.create(options);
            response.json({
                success : true ,
                message : paymentResponse ,
            })
        } catch(error) {
            console.log(error);
            return response.status(500).json({
                success : false ,
                message : "Could Not Initiate Order"
            });
        }

    }

    // Verify The Payment
    exports.verifyPayment = async(request , response) => {
        const razorpay_order_id = request.body?.razorpay_order_id;
        const razorpay_payment_id = request.body?.razorpay_payment_id;
        const razorpay_signature = request?.body.razorpay_signature;
        const courses = request.body?.courses;
        const userId = request.User.id;

        if(
           !razorpay_order_id   || 
           !razorpay_payment_id ||
           ! razorpay_signature || 
           ! courses || !userId ) {

            return response.status(200).json({success: false , message : "Payment Failed!"});

            }

            let body = razorpay_order_id + "|" + razorpay_payment_id;

            const expectedSignature = crypto 
            .createHmac("sha256" , process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

            if(expectedSignature === razorpay_signature) {
                // enroll karwao students ko
                await enrollStudents(courses , userId , response);

                // return response
                return response.status(200).json({success : true , message : "Payment Verified . . ." });
            }
            return response.status(500).json({success: false , message : "Payment Failed!"});

    }

    const enrollStudents = async(courses , userId , response) => {

        if(!courses || !userId) {

            return response.status(400).json({success : false , message: "Please Provide data for courses or UserId"});

        }

        for(const courseId of courses) {

            try {
                 // Find The Course and Enroll The Student In it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId} ,
                {$push: {studentsEnrolled : userId}} ,
                {new : true} , // Update 
            )

            // validation
            if(!enrolledCourse) {
                return response.status(500).json({success : false , message : "Course Not Found!"});
            }

            const courseProgress = await CourseProgress.create({
                courseID:courseId,
                userId:userId,
                completedVideos: [],
            })

            // find the student and add the course to their list of enrolledcourse
            const enrolledStudent = await User.findByIdAndUpdate(userId ,
              {
                $push : {
                    courses : courseId ,
                    courseProgress: courseProgress._id,

                }}, {new : true}) 

                // Bache ko mail send kardo
                const emailResponse = await mailsender (
                    enrolledStudent.email ,
                    `Successfully Enrolled into ${enrolledCourse.courseName}` ,
                    courseEnrollmentEmail(enrolledCourse.courseName , `${enrolledStudent.firstName}`)
                )
                console.log("Email Send Successfully" , emailResponse.response);


            }
            catch(error) {
                console.log(error);
                return response.status(500).json({success : false , message : error.message});
            }
           
        }

    }

    exports.sendPaymentSuccessEmail = async(request , response) => {
        const {orderId , paymentId , amount} = request.body;

        const userId = request.User.id;

        if(!orderId || !paymentId || !amount || !userId) {
            return response.status(400).json({success: false , message: "Please provide all the fields" });

        }
        try {     // Student ko find karo
            const enrolledStudent = await User.findById(userId);
            await mailsender(
                enrolledStudent.email ,
                `Payment Received` ,
                paymentSuccessEmail(`${enrolledStudent.firstName}` ,
                amount / 100 ,
                orderId ,
                paymentId
                )

            )

        }catch(error) {
            console.log("Error in sending mail " , error);
            return response.status(500).json({success: false , message: "Could Not Send Email"})
        }
    }


