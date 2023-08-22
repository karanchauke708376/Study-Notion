import React from "react";
import Instructor from "../../../assets/Images/Instructor.png"
import HightlightText from "./HightlightText"
import { FaArrowRight } from "react-icons/fa"
import CTAButton from "./Button"


const InstructorSection = () => {
    return (
        <div>

            <div className="flex flex-row gap-20 items-center">
                    
                    <div className="w-[50%] mt-16">
                        <img 
                                src={Instructor} 
                                alt='Instructor'
                                className="shadow-white"
                        />

                    </div>
                            
                    <div className="w-[50%] flex flex-col gap-10 ">

                        <div className="text-4xl font-semibold w-[50%] 
                        ">
                            Become an 
                            <HightlightText color={"bg-gradient-to-r from-blue-100 to-caribbeangreen-100 "}  text={" Instructor "} />
                        </div>

                        <p className="font-medium text-[16px] w-[80%] text-richblack-300">
                            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                        </p>

                        
                        <div className="w-fit">
                            <CTAButton active={true} linkto={"/signup"} >
                                <div className="flex flex-row gap-2 items-center text-black">
                                    Start Learnining Today
                                    <FaArrowRight />

                                </div>

                            </CTAButton>


                        </div>
                        

                    </div>




            </div>




        </div>
    )
}

export default InstructorSection;