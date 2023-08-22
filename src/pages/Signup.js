import React from "react";
import signupImg from "../assets/Images/signup.webp"
import Templates from "../components/core/Auth/Template"

const Signup = ({setIsLoggedIn}) => {
    return (

        <Templates
        title = "Join the millions learning to code with StudyNotion for free"
        desc1 = "Build skill today , tommarrow and beyond."
        desc2 = "Education to future-proof your career."
        image={signupImg}
        formtype={"signup"}
        setIsLoggedIn={setIsLoggedIn}
        
        />

       
    )
}

export default Signup