import React from "react"
import CTAButton from "../HomePage/Button"
// import HightlightText from "./HightlightText"
import { FaArrowRight } from "react-icons/fa"
import { TypeAnimation } from "react-type-animation"

const CodeBlocks = ({
    // input value 
    position , heading , subheading , ctabtn1 , ctabtn2 , codeblock , backgroundGradient , codecolor 
}) => {
    return (
        <div className={`flex ${position} my-20 justify-between gap-10 `}>
            
            
        {/* Section - 1 */}
        <div className="w-[50%] flex flex-col gap-8">
            {heading}

            <div className="text-richblack-400 font-bold">
                {subheading}
            </div>

                
            <div className="flex gap-7 mt-7">
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className="flex gap-2 items-center">
                        {ctabtn1.btnText}
                        <FaArrowRight/>

                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                        {ctabtn2.btnText}

                </CTAButton>

            </div>





        </div>

        {/* Section - 2 */}

        <div className="h-fit flex flex-row text-[10px]  py-4 lg:w-[500px]">
            {/* Homework BG - Gradient */}

            <div className='flex relative p-2 shadow-[-1px_-1px] min-w-[300px] shadow-richblack-400'>
            {/* oval gradient  */}
            <div className='absolute w-60 h-40 top-4 left-4 rounded-[230px/150px] blur-3xl hi'></div>
            {/* background behind TypeAnimation  */}
            <div className='absolute left-0 right-0 top-0 bottom-0 bg-richblack-800 opacity-20'></div>
            {/* TypeAnimation block  */}
        
       



            <div className="flex flex-col text-center  w-[10%] text-richblack-400 font-inter font-bold " >
            {/* <div className=  "bg-gradient-to-t from-blue-200 to-pink-300  "> ccdfv vdskmdknx {backgroundGradient} </div> */}

                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
                <p>12</p>
                <p>13</p>


            </div>

            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codecolor} pr-2 `}>
                <TypeAnimation 
                sequence={[codeblock , 2000 , ""]}
                repeat={Infinity}
                cursor={true}

                style={
                    {
                        whiteSpace: "pre-line" ,
                        display: "block" ,

                    }
                }
                omitDeletionAnimation = {true}
            
                />

            </div>

        </div>

        </div>




        </div>
    )
}

export default CodeBlocks;