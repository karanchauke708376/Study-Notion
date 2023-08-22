import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Iconbutton from "../../../../common/Iconbutton";
import {MdAddCircleOutline} from "react-icons/md"
import { useDispatch, useSelector } from "react-redux";
import {BiRightArrow } from "react-icons/bi"
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";
import { toast } from "react-hot-toast";
import { updateSection,createSection } from "../../../../../services/operations/courseDetailsAPI";
import NestedView from "./NestedView";
import { BsCheckLg } from "react-icons/bs";
const CourseBuilderForm = () => {

    // import 
    const {register, handleSubmit , setValue , formState: {errors} } = useForm();
    const [editSectionName , setEditSectionName] = useState(null);
    const {course} =  useSelector((state) => state.course);
    const dispatch =useDispatch();
    const [loading ,setloading] = useState(false);
    const {token} = useSelector((state) => state.auth);

    const onSubmit = async(data) => {
        setloading(true);
        let result;
        console.log("data",data);
        if(editSectionName) {
            console.log("come")
            // we are editing the section name
            result = await updateSection(
                {
                    sectionName: data.SectionName,
                    sectionId : editSectionName,
                    courseId : course._id,
                } , token )
                console.log(result , "New Result");


        } else {
             // we are creating the section name
            result = await createSection(
                {
                    sectionName : data.SectionName ,
                    courseId : course._id, 
                } , token )
        }

        // Update value
        if(result) {
            dispatch(setCourse(result));
            setEditSectionName(null);
            setValue("SectionName" , "");
            console.log(result , "result updated ? ");
        }
        

        // loading false
         setloading(false)

    }



    const cancelEdit = () => {
        setEditSectionName(null);
        setValue("SectionName" , "");
    }

    const goBack = () => {
        dispatch(setStep(1));
        dispatch(setEditCourse(true))
    }
    

    const goToNext = () => {
        console.log("sdsd")
        if(course?.courseContent?.length === 0) {
            toast.error("Please Add Atleast One Section");
            return;
        }
        if(course.courseContent.some((section) => section.subSection.length === 0))  {
            toast.error("please add aleast one lecture in each section");
            return;
        } 
         // if everything is good
         dispatch(setStep(3))

    }

    const handleChangeEditSectionName = (sectionId , sectionName) => {
        if(editSectionName === sectionId) {
            cancelEdit();
            return; 
        }


        setEditSectionName(sectionId);
        setValue("SectionName" , sectionName);

    } 




    return (
        <div className="text-black" >

           <p> Course Builder </p> 
           <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="sectionName" > Section Name <sup> * </sup> </label>
                <input 
                  id = "sectionName"
                  placeholder="Add Section Name"
                  {...register("SectionName" , {required:true})}
                  className="w-full" />
                  {
                    errors.sectionName && (
                        <span>Section Name is required! </span>
                    )
                  }
            </div>

            <div className="mt-10">
                <Iconbutton 
                    type="Submit"
                    text={editSectionName ? "Edit Section Name" : "Create Section"}
                    outline={true} 
                    className={"text-white"}
                >
                    <MdAddCircleOutline className="text-yellow-50" size={20} />
                    
                    </Iconbutton>  
                    {editSectionName && (
                        <button 
                            type="button"
                            onClick={cancelEdit}
                            className="text-sm text-richblack-300 underline ml-10"
                         >
                            Cancel Edit
                        </button>
                    )}   
            </div>

           </form>
           {/* Nested View  */}

           {
            course?.courseContent?.length > 0 && (
                 <NestedView handleChangeEditSectionName={handleChangeEditSectionName}  />
             ) }
            <div className="flex justify-end gap-x-3 mt-10 ">
                <button onClick={goBack} className="rounded-md cursor-pointer flex items-center " >
                    Back
                </button>   

                <Iconbutton text="Next" onclick={() => goToNext()} >
                    <BiRightArrow />
                </Iconbutton>

            </div>




        </div>
    )
}

export default CourseBuilderForm