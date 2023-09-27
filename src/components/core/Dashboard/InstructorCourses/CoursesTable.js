import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table , Tbody , Thead , Tr , Th , Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { COURSE_STATUS } from "../../../../utils/constants";
import { FiEdit2 } from "react-icons/fi"
import { AiFillDelete } from "react-icons/ai"
import ConfirmationModal from "../../../common/ConfirmationModal"
import { deleteCourse , fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI" 
import {setCourse} from "../../../../slices/courseSlice"
import { useNavigate } from "react-router-dom";
import {CalculateCourseTime} from "../../../../utils/dateFormatter"
import { IoCheckmarkCircleOutline } from "react-icons/io5"
import { BiTime } from "react-icons/bi"
 



export default function CoursesTable({courses , setCourses}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {token} = useSelector((state) => state.auth);
    const [loading , setLoading] = useState(false);
    const [confirmationModal , setConfirmationModal] = useState(null);

    const handleCourseDelete = async (courseId) => {

        setLoading(true);

        await deleteCourse({courseId : courseId} , token);
        const result = await fetchInstructorCourses(token);

        if(result) {
            setCourses(result);
        }
        setConfirmationModal(null);
        loading(false);

    }

    return (

        <div>

            <Table className="rounded-xl border border-richblack-800 ">
                <Thead>
                    <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2" >

                        <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-50">
                            Courses
                        </Th>

                        <Th className="text-left text-sm font-medium uppercase text-richblack-50">
                            Duration
                        </Th>

                        <Th  className="text-left text-sm font-medium uppercase text-richblack-50">
                            Price
                        </Th>

                        <Th  className="text-left text-sm font-medium uppercase text-richblack-50">
                            Actions
                        </Th>

                    </Tr>
                </Thead>
                <Tbody>
                    {
                        courses.length === 0 ? (
                            <Tr>
                                <Td className="py-10 text-center text-2xl font-medium text-richblack-5">
                                    No Courses Found
                                </Td>
                            </Tr>
                        )  : (
                            courses?.map((course) => (
                                <Tr key={course.id}
                                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8" >
                                    <Td className="flex flex-1 gap-x-4" >
                                        <img 
                                            src={course?.thumbnail} 
                                            alt= {course?.courseName}
                                            className="h-[148px] w-[220px] rounded-lg object-cover"
                                         />

                                         <div className="flex flex-col justify-between">
                                            <p className="text-lg font-semibold text-richblack-5" > {course.courseName} </p>
                                            <p className="text-xs text-richblack-50" > {course.courseDescription} </p>
                                            <p className="text-[12px] text-white"> Created : 2K23  </p>
                                            {
                                                course.status === COURSE_STATUS.DRAFT ?
                                                 (
                                                    <p  className="flex w-fit text-md flex-row items-center gap-x-2 rounded-md bg-richblack-700 px-2 py-[2px] text-[17px] font-medium text-pink-100">
                                                         DRAFTED <BiTime size={15} /> </p>
                                                ) 
                                                : (
                                                    <p className="flex w-fit text-md items-center gap-x-2  justify-center rounded-md bg-yellow-100 text-richblack-700" >
                                                         PUBLISHED  <IoCheckmarkCircleOutline size={15} />
                                                    
                                                    </p>
                                                )
                                            }

                                         </div>
                                    </Td>

                                    <Td className="text-sm font-medium text-richblack-100" >
                                        {/* {CalculateCourseTime(course?.courseContent)}  */} 2hr 30min
                                    </Td>

                                    <Td className="text-sm font-medium text-richblack-100">
                                    ₹{course.price}
                                    </Td>

                                    <Td className="text-sm font-medium text-richblack-100 " >
                                        <button disable = {loading}
                                         onClick = {() => {
                                            navigate(`/dashboard/edit-course/${course._id}`)
                                         }}  
                                        title="Edit"
                                        className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                                        >
                                         <FiEdit2 size={17} />
                                        </button>

                                        <button disabled = {loading} onClick={() => {
                                            setConfirmationModal({
                                                text1 : "Do you want to delete this course ?" ,
                                                text2 : "All the data related to this course will be deleted" ,
                                                btn1Text : "Delete" ,
                                                btn2Text : "Cancel" ,
                                                btn1Handler :  !loading ? () => handleCourseDelete(course._id) : () => {} ,
                                                btn2Handler :  !loading ? () => setConfirmationModal(null) : () => {} ,
                                            })
                                        }} >
                                            <AiFillDelete size={17}  />
                                        </button>

                                    </Td>

                                    

                                </Tr>
                            ))
                        )
                    }

                </Tbody>

            </Table>
             {/* confirmationModal exist then confirmationModal render important  */}
        {confirmationModal && <ConfirmationModal modalData = {confirmationModal} />}
        
        </div>
    )
}