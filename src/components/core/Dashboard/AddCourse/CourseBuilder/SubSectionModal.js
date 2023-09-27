import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { RxCross1 } from "react-icons/rx";
import Upload from "../Upload";
import Iconbutton from "../../../../common/Iconbutton";

const SubSectionModal = ({
    modalData ,
    setModalData ,
    add = false ,
    view = false ,
    edit = false ,
  }) => {

    const  {
        register ,
        handleSubmit ,
        setValue ,
        formState : {errors} ,
        getValues ,
    } = useForm();

    const dispatch = useDispatch();
    const [loading , setLoading] = useState(false);
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);

    useEffect(() => {
        if(view || edit) {
            setValue("lectureTitle" , modalData.title);
            setValue("lectureDesc" , modalData.description);
            setValue("lectureVideo" , modalData.videoUrl);

        }
    },[])

    const isFormUpdated = () => {
        const currentValues = getValues();

        if (
            currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl ) {
            return true;
        }
         else{

            return false;
        }
    }

    const handleEditSubSection = async () => {

        const currentValues = getValues();
        const formData = new FormData();

        formData.append("sectionId" , modalData.sectionId);
        formData.append("subSectionId" , modalData._id);
        
        // updated values append
        if(currentValues.lectureTitle !== modalData.title) {
            formData.append("title" , currentValues.lectureTitle);
        }

        if(currentValues.lectureDesc !== modalData.description) {
            formData.append("description" , currentValues.lectureDesc);

        }

        if(currentValues.lectureVideo !== modalData.videoUrl) {
            formData.append("videoFile" , currentValues.lectureVideo);
        }

        // when ready form
        setLoading(true);
        
        //API Call
        const result = await updateSubSection(formData , token);
        if(result) {
            //TODO -  Same check
            const updatedCourseContent = course.courseContent.map((section) => 
            section._id === modalData.sectionId ? result : section);
            const updatedCourse = {...course , courseContent : updatedCourseContent};
            dispatch(setCourse(updatedCourse));
        }

        // modal close
        setModalData(null);
        setLoading(false);

    }

    const onSubmit = async(data) => {


        // view call 
        if(view) {  // only video view not changes
            return
        } 
        

        // edit call
        else if(edit) {   // when not update form 
            if(!isFormUpdated) {
                toast.error("No Changes to made to the form . . . ")
            } 
            else {  // when update form
                // edit krdo store mai
                handleEditSubSection();
            }
            return;
        }

        // add call
        const formdata = new FormData();
        formdata.append("sectionId", modalData);
        formdata.append("title" , data.lectureTitle);
        formdata.append("description" , data.lectureDesc);
        formdata.append("videoFile" , data.lectureVideo);
        setLoading(true);
        // API Call

        const result = await createSubSection(formdata , token);

        if(result) {
            // ToDo check for updation
            const updatedCourseContent = course.courseContent.map((section) => 
            section._id === modalData ? result : section);
            const updatedCourse = {...course , courseContent : updatedCourseContent};
            dispatch(setCourse(updatedCourse));
        }

        setModalData(null);
        setLoading(false);

    }

    return (

        <div>

            <div>
                <div>
                    <p>{view && "Viewing"} {add && "Adding"}  {edit && "Editing"} Lecture </p>

                    {/* close cross button */}
                    <button onClick={() => (!loading ? setModalData(null) : {})} 
                    >
                        <RxCross1/>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Upload 
                            name  = "lectureVideo"
                            lebel = "Lecture Video" 
                            register = {register}
                            setValue = {setValue}
                            errors = {errors}
                            video = {true}
                            viewData = {view ? modalData.videoUrl : null }
                            editData = {edit ? modalData.videoUrl : null }
                    />

                    <div>
                        <label> Lecture Title </label>
                        <input 
                            id = "lectureTitle"
                            placeholder=" Enter Lecture Title "
                            {...register("lectureTitle" , {required : true} ) }
                            className="w-full"
                           />
                           {errors.lectureTitle && (
                            <span> Lecture Title Is Required! </span>
                           )}
                    </div>

                    <div>
                        <label> Lecture description </label>
                        <textarea 
                            id = "lectureDesc"
                            placeholder=" Enter Lecture Description "
                            {...register("lectureDesc", {required : true } ) }
                            className = "w-full min-h-[130px]"
                        />
                        {
                            errors.lectureDesc && (
                                <span> Lecture Description Is Required!  </span>
                            )   }
                    </div>

                    {
                        !view && (
                            <div>
                                <Iconbutton 
                                            text={loading ? "Loading ...." : edit ? "Save Changes" : "Save"}
                                />
                            </div>
                        )
                    }

                </form>

            </div>

        </div>

    )
}

export default SubSectionModal