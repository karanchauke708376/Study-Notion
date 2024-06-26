import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";

import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from "../slices/viewCourseSlice";
import  CourseReviewModal  from "../components/core/ViewCourse/CourseReviewModal" ;
import  VideoDetailsSidebar  from "../components/core/ViewCourse/VideoDetailsSidebar";

const ViewCourse = () => {

    const {courseId} = useParams();
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [reviewModal, setReviewModal] = useState(false)


    // useEffect(() => {
    //     const setCourseSpecificDetails = async() => {
    //         const courseData = await getFullDetailsOfCourse(courseId , token);
    //         dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
    //         dispatch(setEntireCourseData(courseData.courseDetails));
    //         dispatch(setCompletedLectures(courseData.completedVideos));
    //         let lectures = 0;
    //         // console.log(courseData , "course data .. . ")
    //         courseData?.courseDetails?.courseContent?.forEach((sec) => {
    //             lectures += sec.subSection.length
                
    //         })

    //         dispatch(setTotalNoOfLectures(lectures))

    //     } ()
    // }, [])
    useEffect(() => {
        ;(async () => {
          const courseData = await getFullDetailsOfCourse(courseId, token)
          // console.log("Course Data here... ", courseData.courseDetails)
          dispatch(setCourseSectionData(courseData.courseDetails?.courseContent))
          dispatch(setEntireCourseData(courseData.courseDetails))
          dispatch(setCompletedLectures(courseData.completedVideos))
          let lectures = 0
          courseData?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length
          })
          dispatch(setTotalNoOfLectures(lectures))
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return (
        <>
            <div className="relative flex z-[500] min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar  setReviewsModal={setReviewModal} /> 
                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className="mx-6">
                        <Outlet />
                    </div>
                </div>

                {reviewModal && (<CourseReviewModal setReviewsModal = {setReviewModal} />)}

            </div>


                

        </>
    )
}

export default ViewCourse