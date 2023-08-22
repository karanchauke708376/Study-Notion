import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI";
import { useForm } from "react-hook-form"
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import RequirementField from "./RequirementField";
import Iconbutton from "../../../../common/Iconbutton";
import { setCourse , setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import { toast } from "react-hot-toast";
import ChipInput from "../CourseBuilder/ChipInput";
import Upload from "../Upload";
import { MdNavigateNext } from "react-icons/md";

export default function CourseInformationForm()  {

    const  {
        register ,
        handleSubmit ,
        setValue ,
        getValues  ,
        formState:{errors},
    }  = useForm();  // fetch data from useForm

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const {course , editCourse} = useSelector((state) => state.course);
    const [loading , setLoading] = useState(false);
    const [courseCategories , setcourseCategories] = useState([]);

        // category fetch
        useEffect( () => {
            const getCategories = async() => {
                setLoading(true);  // loader . . . 
                const categories = await fetchCourseCategories(); // this file add from service/operation/courseDetailAPI
                if(categories.length > 0)  
                setcourseCategories(categories);
            }
            setLoading(false);

            if(editCourse) {
                setValue("courseTitle" , course.courseName);
                setValue("courseShortDesc" , course.courseDescription);
                setValue("coursePrice" , course.price);
                setValue("courseTags" , course.tag);
                setValue("courseBenefits" , course.whatYouWillLearn);
                setValue("courseCategory" , course.category);
                setValue("courseRequirements" , course.instructions);
                setValue("courseImage" , course.thumbnail);

            } // after fetch , then call 
            getCategories();
        } , []) 

            // form update or not 
            const isFormUpdated = () => {
                const currentValues = getValues();
                if(
                currentValues.courseTitle !== course.courseName || 
                currentValues.courseShortDesc !== course.courseDescription ||
                currentValues.coursePrice !== course.price ||
                currentValues.courseTags.toString() !== course.tag.toString() ||
                currentValues.courseBenefits !== course.whatYouWillLearn ||
                currentValues.courseCategory._id !== course.category._id ||
                currentValues.courseImage !== course.thumbnail ||
                currentValues.courseRequirements.toString() !== course.instructions.toString()
                ) {
                return true
                }
                return false
                
            }
        // submit 
        // handle next button click
    const onSubmit = async(data) => {

        if(editCourse) {
            const formData = new FormData();
            if(isFormUpdated()) 
            {
                 try{
                    {
                        const currentValues = getValues();
                       
        
                        formData.append("courseId" , course._id);
                        if(currentValues.courseTitle !== course.courseName) {
                            formData.append("courseName" , data.courseTitle);
                        }
        
                        if(currentValues.courseShortDesc !== course.courseDescription) {
                            formData.append("courseDescription" , data.courseShortDesc);
                        }
        
                        if(currentValues.coursePrice !== course.price) {
                            formData.append("price" , data.coursePrice);
                        }
        
                        if(currentValues.courseBenefits !== course.whatYouWillLearn) {
                            formData.append("WhatYouWillLearn" , data.courseBenefits);
                        }
        
                        if(currentValues.courseCategory._id !== course.category._id) {
                            formData.append("category" , data.courseCategory);
                        }
        
                        if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                            formData.append("instructions" , JSON.stringify(data.courseRequirements));
                        }
        
                        // Homework temp  --- >  comment
                        if(currentValues.courseTags.toString() !== course.tag.toString()) {
                            formData.append("course tag " , JSON.stringify(data.courseTags));
                        }
        
                        if(currentValues.courseImage !== course.thumbnail) {
                            formData.append("thumbnail Images " , data.courseImage);
                        }
        
                        setLoading(true);
                        const result = await editCourseDetails(formData , token);
                        setLoading(false);
                        if(result) {
                            dispatch(setStep(2));
                            dispatch(setCourse(result));
                        }
                    }
                 }
                 catch(error) {
                     console.log("errror", error)
                 }
            }
            else {
                toast.error("No Changes Made To The Form ");
            }
            console.log("Printing Form Data 2 " , formData);
            console.log("Printing Result 2 " , result);
            return ;
        }

        // create a new course
        const formData = new FormData();
        formData.append("courseName" , data.courseTitle);
        formData.append("courseDescription" , data.courseShortDesc);
        formData.append("price" , data.coursePrice);
        formData.append("tag" , JSON.stringify(data.courseTags));
        formData.append("whatYouWillLearn" , data.courseBenefits);
        formData.append("category" , data.courseCategory);
        formData.append("instructions" , JSON.stringify(data.courseRequirements));
        formData.append("thumbnailImage" , data.courseImage);
        // status pass
        formData.append("status" , COURSE_STATUS.DRAFT);

        setLoading(true);
        const result = await addCourseDetails(formData, token);
        console.log(result ," Form Data ");  

        if(result) {
            dispatch(setStep(2));
            dispatch(setCourse(result));
        }
        setLoading(false);
    }


    return (

        <form 
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md border-richblack-700 bg-richblack-900 p-6 space-y-8 border-[1px] text-richblack-5   "
        >
            <div className="flex flex-col space-y-2">
                <label  className="text-sm text-richblack-5" htmlFor="courseTitle" > Course Title 
                <sup className="text-pink-200">*</sup> </label>
                <input 
                    id = 'courseTitle'
                    placeholder="Enter Course Title"
                    {...register("courseTitle" , {required:true})} 
                    className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)]'
                />  

                {
                    errors.courseTitle && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200 "> Course Title Is Required  </span>
                    )
                }
                
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseShortDesc" > Course Short Description <sup className="text-pink-200"> * </sup> </label>
                <textarea 
                    id = 'courseShortDesc'
                    placeholder="Enter Description"
                    {...register("courseShortDesc" , {required:true})}
                    className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)]'
                />
                {
                    errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200 ">
                        Course Description is Required! 
                    </span>)
                }
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="coursePrice" > Course Price <sup className="text-pink-200">*</sup> </label>
                <div className="relative">
                <input 
                    id = 'coursePrice'
                    placeholder="       Enter Course Price"
                    {...register("coursePrice" , {
                        required:true,
                        valueAsNumber:true,
                        pattern: {
                            value: /^(0|[1-9]\d*)(\.\d+)?$/,
                          },

                    })} 
                    className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)] w-full'
                />  

                <HiOutlineCurrencyRupee className="absolute top-1/2 text-richblack-400 left-3  inline-block -translate-y-1/2 text-2x1 " />  
                </div>

                {   
                
                    errors.coursePrice && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200 "> Course Price Is Required!  </span>
                    )
                }
                
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseCategory"> Course Category
                 <sup className="text-pink-200"> * </sup> </label>
                <select 
                    id = "courseCategory"
                    defaultValue=""
                    {...register("courseCategory" ,{required:true})}
                    className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)]'
                >
                        <option value="" disabled > Choose a Category  </option>

                        {
                              courseCategories.map((category , index) => (
                                <option key={index} value={category?._id} >
                                    {category?.name}
                                    </option>
                            ))
                        }
                </select>        
                        {
                            errors.courseCategory && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200 ">
                                    Course Category is Required! 
                                </span>
                            )
                        }
            </div>

            {/* create a custum components for handling tag input homework */}
            <ChipInput 
                label = "Tags"
                name = "courseTags"
                placeholder = "Enter tag and press enter"
                register = {register}
                errors = {errors}
                setValue = {setValue}
                getValues = {getValues}

                /> 

            {/* create a components for uploading and showing preview of media  homework */}
            <Upload 
                name = "courseImage" 
                label = "Course Thumbnail"
                register={register}
                errors = {errors}
                setValue={setValue}
                editData={editCourse ? course?. thumbnail : null}

                />
          

           <div className="flex- flex-col space-y-2">
            <label className="text-sm text-richblack-5"> Benefits Of The Course <sup className="text-pink-200 "> * </sup> </label>
            <textarea rows={5} 
                id="courseBenefits"
                placeholder="Enter Benefits of the course"
                {...register("courseBenefits" , {required:true})}
                className='bg-richblack-800  rounded-md placeholder:text-richblack-200 p-2 focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)] w-full' />

                {
                    errors.courseBenefits && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                            Benefits of the course are required!
                        </span>
                    )
                }
            
           </div>

           <RequirementField 
                name = "courseRequirements"
                label = "Requirements/Instructions"
                register = {register}
                errors = {errors}
                setValue = {setValue}
                getValues = {getValues}

                
        
            />

            




                <div className="flex justify-end gap-x-2">

                    {
                        editCourse && (
                        <button onClick={() =>{ 
                             console.log("continue triggred")
                            dispatch(setStep(2))}}
                            className={`flex cursor-pointer items-center gap-x-2 rounded-md  bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900 `}
                            >
                                Continue Without Saving
                        </button>

                        )
                    }
                    
                        <div className="text-white">
                        <Iconbutton> 

                        <button type="submit" >
                            Next  
                        </button>
                        
                    <MdNavigateNext/>
                    </Iconbutton>
                    </div>

                </div> 


        </form>   

    )
}

