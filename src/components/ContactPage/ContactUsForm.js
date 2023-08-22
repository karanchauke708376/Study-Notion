import React, { useEffect, useState } from "react";
import { useForm }  from "react-hook-form"
import { apiConnector } from "../../services/apiconnector";
import { contactusEndpoint } from "../../services/apis";
import CountryCode from "../../data/countrycode.json"
import Footer from "../core/HomePage/Footer";

const ContactUsForm = () => {

    const [loading , setLoading] = useState(false);
    const {
        register ,
        handleSubmit ,
        reset,
        formState: {errors , isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        console.log("Logging Data " , data);
        try {
            setLoading(true);
            // const response1 = await apiConnector("POST" , contactusEndpoint.CONTACT_US_API , data);
            const response2 = await apiConnector(
                "POST" ,
                contactusEndpoint.CONTACT_US_API ,
                data
            )
            console.log("Logging Response " , response2);
            setLoading(false);

        }catch(error) {
            console.log("Error : " , error.message);
            setLoading(false);

        }

    }

    useEffect( ()=> {
        if(isSubmitSuccessful) {
            reset({
                email:"",
                firstname:"",
                lastname:"",
                message:"",
                phoneNo:"",
            })
        }
    },[reset , isSubmitSuccessful]);  // form change , function change
 
    
    
    return (
        <form  className="flex flex-col gap-7"
        onSubmit={handleSubmit(submitContactForm)}>

          <div className=" flex flex-col gap-5 lg:flex-row">

          {/* <div className="flex flex-col gap-2 lg:w-[48%] "> */}
                {/* first name */}

                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstname" className="lable-style" >First Name  </label>
                    <input 
                        type="text"
                        name='firstname'
                        id='firstname'
                        placeholder=" Enter First Name "
                        className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)]'
                        {                // Registration
                            ...register("firstname" , {required:true})
                        } 
                        />
                                         {/* Error Handling First Name se releated */}
                        {
                            errors.firstname && (
                                <span  className="-mt-1 text-[12px] text-yellow-100">
                                    Please Enter Your Name
                                </span>
                            )
                        }                
                    
                   
                </div>

                  {/* last name */}
                  <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="lastname" >Last Name  </label>
                        <input 
                            type="text"
                            name='lastname'
                            id='lastname'
                            placeholder="Last Name"
                            className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)]'
                            {                // Registration
                                ...register("lastname")
                            } 
                    />
                                            
                   
                </div>

            </div> 

                  {/*  Email Address */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" > Email Address </label>
                    <input 
                    type="email"
                    name="email"
                    id="email"
                    className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)]'
                    placeholder=" Enter Email Address "

                    {...register("email" , {required:true})}
                    />

                    {
                        errors.email && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please Enter Your Email Address
                            </span>
                        )
                    }

    
                  </div>


                  {/* phoneNo */}
                  <div>

                    <label className="flex flex-col gap-2"
                    htmlFor="phonenumber"> Phone Number </label>

                    <div className="flex  gap-5">
                        {/* Dropdown */}
                        <div className="flex w-[98px] flex-col gap-2" >
                            <select 
                                name="dropdown"
                                id="dropdown"
                                className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)]' 
                                
                                {...register("countrycode" , {required:true})}
                              >
                                {
                                        CountryCode.map( (element , index) => {
                                            return (
                                                <option key={index} value={element.code} >
                                                    {element.code} - {element.country}
                                                </option>
                                            )
                                    }   )
                                }
                            </select>
                         </div>

                        {/* phonenumber */}
                        <div className="flex w-[calc(100%-90px)] flex-col gap-2" >
                            <input
                              type="number"
                              name="phonenumber"
                              id="phonenumber"
                              placeholder="123456789"
                              className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)]'
                              {...register("phoneNo" , 
                              {
                                required:{value:true, message:"Please Enter Phone Number "},
                                maxLength: {value:10 , message:"Invalid Phone Number! " } ,
                                minLength: {value:8 ,  message:"Invalid Phone Number! "}     } )}
                            />
                        </div>
                    </div>

                    {
                        errors.phoneNo && (
                            <span className="-mt-1 text-[12px] text-yellow-100" >
                                {
                                    errors.phoneNo.message
                                }
                            </span>
                        )
                    }



                  </div>



                  {/* Message  */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="message"> Message </label>
                    
                    <textarea 
                    name="message"
                    id="message"
                    cols="30"
                    rows="7"
                    className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)]'
                    placeholder=" Enter Your Message Here " 
                    {...register("message" , {required:true} )}
                    />
                    {
                        errors.message && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please Enter Your Message
                            </span>
                        )
                    }

                </div>

                <div>
                    
                <button type="submit" className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
                 ${
                    !loading &&
                    "transition-all duration-200 hover:scale-95 hover:shadow-none"
                  }  disabled:bg-richblack-500 sm:text-[16px] `}
                  >
                    Send Message

                </button>


                </div>


        </form>



    
        
    )
}

export default ContactUsForm