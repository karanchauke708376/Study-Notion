import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"


import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
       
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link to="/update-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm



// import React, { useState }  from "react";
// import { toast } from "react-hot-toast";
// import {AiOutlineEye , AiOutlineEyeInvisible } from 'react-icons/ai';
// import { Link, useNavigate } from "react-router-dom";

// const LoginForm = ({setIsLoggedIn}) => {

//     const navigate = useNavigate();

//     const [formData , setFormData] = useState( {
//         email:"" , password:""

//     })

//     const [showPassword , setShowPassword] = useState(false);

//      function changeHandler(event) {

//             setFormData( (prevData) => (
//                 {
//                     ...prevData, 
//                     [event.target.name]:event.target.value
//                 }
//             ) )
//      }

//      function submitHandler(event) {
//         event.preventDefault();
//         setIsLoggedIn(true);
//         toast.success("Logged In");
//         console.log("Printing The FormData");
//         console.log(formData);
//         navigate('/dashboard/my-profile');

//      }

//     return (

//         <form onSubmit={submitHandler} className='flex flex-col w-full gap-y-4 mt-6' >
//             <label className="w-full relative">
//                 <p className="text-[0.875rem] text-white mb-1 leading-[1.375rem]">
//                     Email Address<sup className="text-pink-200">*</sup>
//                 </p>
            
//                 <input required type = 'email' value={formData.email}
//                   onChange={changeHandler} placeholder='Enter email address' name='email'
//                    className="bg-richblack-800 rounded-[0.5rem]  text-white w-full p-[12px]  " />

//             </label>

//             <label className="relative"> 
//                 <p className="text-[0.875rem] text-white mb-1 leading-[1.375rem]">
//                      Password <sup  className="text-pink-200">*</sup>
//                 </p>
            
//                 <input required type = {showPassword ? ('text') : ('password')}
//                   value={formData.password}
//                   onChange={changeHandler} placeholder='Enter Your Password' name='password' 
//                   className="bg-richblack-800 rounded-[0.5rem]  text-white w-full p-[12px]  "  />

//                   <span className="absolute right-3 top-[38px] cursor-pointer  " onClick={() => setShowPassword( (prev) => !prev)}>
//                      {showPassword ? 
//                      (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) :
//                      (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>) } </span>
                     
//                      <Link to="/forgot-password"> <p className="text-x5 mt-1 text-blue-100 max-w-max ml-auto  "> Forgot Password </p> </Link>

//             </label>

//                 <button className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6"> Sign In </button>


//         </form>


//     )
// }


//     export default LoginForm


    