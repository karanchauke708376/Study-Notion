import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import  GetAvgRating  from "../../../utils/avgRating"
import  RatingStars  from "../../common/RatingStars"

const Course_Card = ({course , Height}) => {

    const [avgRaviewCount , setavgRaviewCount ] = useState(0);

    useEffect(() => {
        const count = GetAvgRating(course.ratingAndReviews);
        setavgRaviewCount(count);
    }, [course])


    
    return (

        <>

            <Link to={`/courses/${course._id}`}>
                <div>
                    <div className="rounded-lg">
                        <img 
                            src={course?.thumbnail}
                            alt="thumbnail" 
                            className={`${Height} w-full rounded-lg object-cover`}
                         />
                    </div>
                    <div className="flex flex-col gap-2 px-1 py-3">
                        <p className="text-xl text-richblack-5"> {course?.courseName} </p>
                        <p className="text-sm text-richblack-50"> {course?.instructor?.firstName} {course?.instructor?.lastName} </p>
                        <div className="flex items-center gap-3">
                            <span className="text-yellow-5"> {avgRaviewCount || 0 }  </span>
                            <RatingStars Review_Count={avgRaviewCount} />
                            <span className="text-richblack-400"> {course?.ratingAndReviews?.length}   Review Count  </span>
                        </div>
                        <p className="text-xl text-richblack-5" > Rs. {course?.price}</p>
                    </div>
                </div>

            </Link>


        </>
    )
}

export default Course_Card