import React from "react"

import {Swiper , SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {Autoplay , FreeMode,Navigation, Pagination , } from "swiper/modules"

import CourseCard from "./CourseCard"

const CourseSlider = ({Courses}) => {
    
    return (

        <>
            {
                Courses?.length ? (
                    <Swiper 
                    slidesPerView = {1} 
                    loop = {true} 
                    spaceBetween = {25}
                    pagination = {true}
                    modules = {[Autoplay,Pagination, FreeMode ,Navigation]}
                    autoplay = {{
                    delay: 1000 ,
                    disableOnInteraction : false,
                    }}
                    navigation = {true}
                    breakpoints={{
                        1024:{
                            slidesPerView: 3,
                        },
                    }}
                    className = "mySwiper max-h-[30rem] "


                    >
                        {
                            Courses?.map((course , index) => (
                                <SwiperSlide key = {index}>
                                    <CourseCard course={course} Height={"h-[250px]"} />
                                </SwiperSlide>
                            ))
                        }

                    </Swiper>
                ) : (
                    <p className="text-xl text-richblack-5"> No Course Found! </p>
                )

            }

        
        </>
       
    )
}

export default CourseSlider