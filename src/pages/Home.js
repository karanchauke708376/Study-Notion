import React from "react"
import { Link } from "react-router-dom"
import {FaArrowRight} from "react-icons/fa"
import HightlightText from "../components/core/HomePage/HightlightText"
import CTAButton from "../components/core/HomePage/Button" 
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import TimelineSection from "../components/core/HomePage/TimelineSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import Footer from "../components/core/HomePage/Footer"
import ReviewSlider from "../components/common/ReviewSlider"




const Home = () => {
    return (

        <div>

            {/*  Section - 1  - Black Background */ }

            <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center
             text-white justify-between ">

                <Link to={"/signup"}>
                    <div className=" group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200   hover:scale-95 w-fit border-solid "> 
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                         transition-all duration-200 border-b-2
                         group-hover:bg-richblack-900  ">
                            <p>Become an Instructor</p>
                            <FaArrowRight/>

                        </div>
                    </div>

                </Link>

                <div className="text-center text-4xl font-semibold mt-6">
                    Empower Your Future With 
                    <HightlightText color={"bg-gradient-to-r from-blue-100 to-caribbeangreen-100 "} text={"Coding Skills"} />
                </div>

                <div className="mt-4 w-[80%] text-center text-lg font-thin text-richblack-300" >
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
                </div>

                <div className="flex flex-row gap-7 mt-8">

                    <CTAButton active={true} linkto={"/signup"} > Learn More</CTAButton>

                    <CTAButton active={false} linkto={"/login"} > Book a Demo</CTAButton>

                </div>

                <div className="mx-3 my-14 shadow-blue-50 relative  ">
                <div className='absolute w-40 h-40 sm:w-72 sm:h-72 top-0 left-1/2 -translate-x-1/2 shadow-[0px_0px_350px] shadow-blue-50 rounded-full'></div>
                    <video
                    muted
                    loop
                    autoPlay
                    className="relative "
                    >
                        <source src={Banner} type="video/mp4" />


                    </video>  
                   

                </div>

                {/* Code Section - Animation Coding 1 */}

                <div >
                    <CodeBlocks 
                        position={"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock your 
                                <HightlightText color={"bg-gradient-to-r from-blue-100 to-caribbeangreen-100 "}  text={" Coding Potential "}/> 
                                with our online courses
                            </div>
                        }
                        subheading = {
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1 = {
                            {
                                btnText: "Try It Yourself" ,    
                                linkto: "/signup",
                                active: true ,                                                                                                                                                             
                            }
                        }
                        ctabtn2 = {
                            {
                                btnText: "Learn More" ,
                                linkto: "/login" ,
                                active: false ,

                            }
                        }
                        codeblock = {
                            `<!DOCTYPE html> 
                            <html>  
                            <head> <title> Study-Notion </title> 
                            <link rel="stylesheet" href="styles.css">
                            </head> 
                            <body>  
                            <h1> <a href = "/"> Header </a>  
                            </h1>  
                            <nav> <a href="one"> One </a>  
                                  <a href="two"> Two </a>  
                                  <a href="Three"> Three </a>  
                            </nav>      
                        `}
                        codecolor={"text-yellow-25 "}
                        
                    
                        />
                </div>

                {/* Code Section - Animation Coding 2 */}

                <div>

                
                    <CodeBlocks 

                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Start 
                                <HightlightText color={"bg-gradient-to-r from-blue-100 to-caribbeangreen-100 "}  text={" Coding In Seconds "}/> 
                                
                            </div>
                        }
                        subheading = {
                            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1 = {
                            {
                                btnText: "Continue Lesson" ,    
                                linkto: "/signup",
                                active: true ,                                                                                                                                                             
                            }
                        }
                        ctabtn2 = {
                            {
                                btnText: "Learn More" ,
                                linkto: "/login" ,
                                active: false ,

                            }
                        }
                        codeblock = {
                            `<!DOCTYPE html> 
                            <html>  
                            <head> <title> Study-Notion </title> 
                            <link rel="stylesheet" href="styles.css">
                            </head> 
                            <body>  
                            <h1> <a href = "/"> Header </a>  
                            </h1>  
                            <nav> <a href="one"> One </a>  
                                  <a href="two"> Two </a>  
                                  <a href="Three"> Three </a>  
                            </nav>      
                        `}
                        codecolor={"text-yellow-25"}
                        
                        
                        
                        />
                </div>

                <ExploreMore/>

            </div>    


            {/*  Section - 2 White Background */ }
            <div className="bg-pure-greys-5 text-richblack-700">
                <div className="homepage_bg h-[310px]">


                    <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto justify-center">
                        <div className="h-[140px]"></div>
                        {/* Button */}
                        <div className="flex flex-row gap-10 text-white py-10 ">
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className="flex gap-3 items-center  ">
                                    Exploring Full Catalog 
                                    <FaArrowRight/>
                                </div>
                                
                            </CTAButton>

                            <CTAButton active={false} linkto={"/login"} >
                                <div>
                                     Learn More
                                     </div>

                            </CTAButton>

                        </div>


                    </div>

                </div>


                <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center 
                  justify-between gap-7">

                    <div className="flex flex-row gap-14 mb-10 mt-[95px] ">
                        <div className="text-4xl font-semibold w-[45%] ">
                            Get the skills you need for a 
                            <HightlightText color={"bg-gradient-to-r from-blue-100 to-caribbeangreen-100 "}  text={" Job That Is In Demand "} />
                        </div>

                        <div className="flex flex-col gap-10 w-[40%] items-start ">
                            <div className="text-[16px] "> 
                              The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div> 
                            <CTAButton active={true} linkto={"/signup"}>
                                    Learn More

                            </CTAButton>

                        </div>

                    </div>

                  <TimelineSection />

                  <LearningLanguageSection/>
                   

                </div>

                

            
            </div>   



            {/*  Section - 3 Black Background */ }
            <div className="w-11/12 mx-auto flex flex-col max-w-maxContent items-center justify-between gap-8 ring-richblack-900 text-white "> 
                
                <InstructorSection/>

                <h2 className="text-center text-4xl font-semibold mt-10">Review From Others Learners</h2>
                {/* Review Sider here */}

                <ReviewSlider/>








            </div>








            {/*  Section - 4 Footer / Homework */ }



        {/*Footer */}
        <Footer />





        </div>
    )
}

export default Home