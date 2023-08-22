import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore"
import HightlightText from "./HightlightText";
import CourseCard from "../../../components/core/HomePage/CourseCard"

const tabsName = [
    "Free",
    "New to coding" ,
    "Most popular" ,
    "Skill paths" ,
    "Career paths" ,
];

const ExploreMore = () => {

    const [currentTab , SetCurrentTab] = useState(tabsName[0]);  // currentTab ki value aa gayee
    const [courses , SetCourses] = useState (HomePageExplore[0].courses); // tab click courses kon kon se hai
    const [currentCard , SetCurrentCard] = useState(HomePageExplore[0].courses[0].heading);  // currentCard ki heading

    // this function - > currenttab , currentcourse , currentcard ko updated karta hai 
    const setMyCards = (value) => {
        SetCurrentTab(value);                  // new course find value , filter 
        const result = HomePageExplore.filter((course) => course.tag === value);
        SetCourses(result[0].courses);
        SetCurrentCard(result[0].courses[0].heading);
    }




    return(

        <div className="flex flex-col">
            <div>
                <div className="text-4xl font-semibold text-center">
                        Unlock the 
                        <HightlightText color={"bg-gradient-to-r from-blue-100 to-caribbeangreen-100 "}  text={" Power of Code "} />
                    

                    <p className="text-center text-richblack-300 text-sm text-[20px] mt-3 ">
                    Learn to build anything you can imagine
                    </p>
                </div>
            </div>

            <div className="mb-5 mt-5 self-center  w-fit flex flex-row  rounded-full bg-richblack-800 border-richblack-100 px-2 py-2" >
                 {
                tabsName.map( (element , index) => {
                    return (
                        <div 
                            className={`text-[16px] flex flex-row items-center gap-2 
                                        ${currentTab === element
                                        ?  "bg-richblack-900 text-richblack-5 font-medium" 
                                        : "text-richblack-200" } rounded-full transition-all duration-200 cursor-pointer
                                           hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2 `}
                                            key={index} onClick={() => setMyCards(element)} >
                                            {element}
                        </div>
                    )
                })
            }
            </div>

                <div className="h-[150px] ">

                    {/* course card ka group */}

                    { <div className=" flex flex-row gap-10 justify-between w-full"> 
                        {
                        courses.map( (element , index) => {
                            return (
                                <CourseCard  
                                key={index}
                                cardData = {element}
                                currentCard = {currentCard}
                                SetCurrentCard = {SetCurrentCard}
                                />

                            )

                          })
                        }
                    </div> }


                </div>

        </div>

    )
 
}

export default ExploreMore;