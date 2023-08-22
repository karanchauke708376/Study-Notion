import React from "react";
import Templates from "../components/core/Auth/Template"
import loginImg from "../assets/Images/login.png"
const Login = ({setIsLoggedIn}) => {
    return (<div> <Templates
        title="Welcome Back" 
        desc1 = "Build skill today , tommarrow and beyond."
        desc2 = "Education to future-proof your career."
        image={loginImg}
        formtype={"login"}
        setIsLoggedIn={setIsLoggedIn}
        
        />
        </div>

    )
}

export default Login