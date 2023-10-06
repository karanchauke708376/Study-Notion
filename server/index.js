const express = require("express");
const app = express();

//routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course"); // extra ee beacouse Course already exist

// connection establishment
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// port connection
dotenv.config();
const PORT = process.env.PORT || 4000 ;

// database connect
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        // origin: "http://localhost:3000" ,
        origin: "*" ,
        credentials: true ,   // Aur Extra kya kya add kar sakta means credentials  ,
                              // Google Define -  the server allows cookies (or other user credentials) to be included on cross-origin requests.

    })
)

app.use(
    fileUpload({
        useTempFiles: true ,
        tempFileDir: "/tmp" ,

    })
)

// cloudinary connection
cloudinaryConnect();

//routes mound
app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/payment" , paymentRoutes);
app.use("/api/v1/course" , courseRoutes);

// default route
app.get("/" , (request, response) => {
    return response.json({
        success: true ,
        message: "Your Server Is Up and Running . . . " ,
    })

});


// defualt routes
app.listen(PORT , () => {
    console.log(`App Is Running At ${PORT} . . .  `);
} )   




