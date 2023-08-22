import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"

function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { firstName, lastName, email, password, confirmPassword } = formData

  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }
    const signupData = {
      ...formData,
      accountType,
    }

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData))
    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate))

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ]

  return (
    <div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />
      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className="flex gap-x-4">
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
        </div>
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
        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
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
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
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
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default SignupForm




// import React, { useState } from 'react'
// import { toast } from 'react-hot-toast'

// import {AiOutlineEye , AiOutlineEyeInvisible } from 'react-icons/ai'
// import { useNavigate } from 'react-router-dom'

// const SignupForm = ({setIsLoggedIn}) => {
//     const navigate = useNavigate();


//     const [formData , setFormData] = useState( {
//         firstName:'',
//         lastName:'',
//         email:'',
//         password:'',
//         confirmPassword:''

//     })

//     const [showPassword , setShowPassword] = useState(false); 
//     const [showConfirmPassword , setShowConfirmPassword] = useState(false); 

//     const [accountType , setAccountType] = useState('student');

//      function changeHandler(event) {

//             setFormData( (prevData) => (
//             {
//                  ...prevData ,
//                 [event.target.name] : event.target.value
//             }
//         ) ) 
                
//      }

//       function submitHandler(event) {
//         event.preventDefault();
//             if(formData.password !== formData.confirmPassword) {
//                 toast.error("Password Do Not Match !");
//                 return;
//             }
      

//       setIsLoggedIn(true);
//       toast.success("Account Created");
//       const acoountData = {
//         ...formData
//       };

//       const finalData = {
//         ...acoountData,
//         accountType
//       } 
//       console.log("Printing Final Account Data");
//       console.log(finalData);

//       navigate('/dashboard');
//         }
//     return (

//         <div>

//             {/* Student-Instructor Tab */}
//             <div className='flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max'>

//                 <button className={`${accountType === 'student' ? 'bg-richblack-900 text-richblack-5' : 'bg-transparent text-richblack-200'} py-2 px-5 rounded-full transition-all duration-200 `}

//                       onClick={() => setAccountType('student')}> Student </button>

//                 <button className={`${accountType === 'instructor' ? 'bg-richblack-900 text-richblack-5' : 'bg-transparent text-richblack-200'} py-2 px-5 rounded-full transition-all duration-200 `}

//                       onClick={() => setAccountType('instructor')}> Instructor </button>

//             </div>

//             <form onSubmit={submitHandler}>

//                 <div className='flex gap-x-4 mt-[20px]'>
//                             {/* firstname and lastname */}

//                     <label className='w-full'>
//                             <p className="text-[0.875rem] text-white mb-1 leading-[1.375rem]">First Name<sup className="text-pink-200">*</sup></p>
//                             <input required type='text' name='firstName' onChange={changeHandler} 
//                                 placeholder='Enter First Name'  value={formData.firstName} 
//                                 className="bg-richblack-800 rounded-[0.5rem]  text-white w-full p-[12px]  " />
//                     </label>

                    
//                     <label className='w-full'>
//                         <p className="text-[0.875rem] text-white mb-1 leading-[1.375rem]">Last Name<sup className="text-pink-200">*</sup></p>
//                         <input required type='text' name='lastName' onChange={changeHandler} 
//                                placeholder='Enter Last Name'  value={formData.lastName} 
//                                className="bg-richblack-800 rounded-[0.5rem]  text-white w-full p-[12px]  "  />
//                     </label>
   


//                 </div>
//                                 {/* Email  */}
//                 <div className='mt-[20px]' >
//                 <label className='w-full mt-[20px]'>
//                         <p className="text-[0.875rem] text-white mb-1 leading-[1.375rem]">Email Address <sup className="text-pink-200">*</sup></p>
//                         <input required type='email' name='email' onChange={changeHandler} 
//                                placeholder='Enter Email Address '  value={formData.email} 
//                                className="bg-richblack-800 rounded-[0.5rem]  text-white w-full p-[12px]  " />
//                 </label>
//                 </div>
               

//                             {/* create password and confirm password */}
//                         <div className='w-full flex gap-x-4 mt-[20px]'>
//                             <label className='relative w-full'>
//                         <p className="text-[0.875rem] text-white mb-1 leading-[1.375rem]">Create Password<sup className="text-pink-200">*</sup></p>
//                         <input required type= {showPassword ? ('text') : ('password')} name='password'
//                          onChange={changeHandler} placeholder='Enter Passoword '  value={formData.password} 
//                          className="bg-richblack-800 rounded-[0.5rem]  text-white w-full p-[12px]  " />
 
//                             <span className="absolute right-3 top-[38px] cursor-pointer  " 
//                              onClick={() => setShowPassword( (prev) => !prev)}>
//                                 {showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) :
//                                  (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
//                             </span>
//                         </label>

//                         <label className='w-full relative'>
//                         <p className="text-[0.875rem] text-white mb-1 leading-[1.375rem]"> Confirm Password<sup className="text-pink-200">*</sup></p>
//                         <input required type= {showConfirmPassword ? ('text') : ('password')} name='confirmPassword'
//                          onChange={changeHandler} placeholder='Confirm Passoword '  value={formData.confirmPassword} 
//                          className="bg-richblack-800 rounded-[0.5rem]  text-white w-full p-[12px]  " />

//                             <span className='absolute right-3 top-[38px] cursor-pointer '
//                              onClick={() => setShowConfirmPassword( (prev) => !prev)}>
//                                 {showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) :
//                                  (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
//                             </span>
//                         </label>
//                  </div>

//                  <button className="bg-yellow-50  w-full rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6"> Create Account </button>
                   


//             </form>



//         </div>


//     )
// }

//     export default SignupForm


    