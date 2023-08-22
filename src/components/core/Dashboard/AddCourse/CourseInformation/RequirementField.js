import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RequirementField = ({name , label , register , errors , setValue , getValues }) => {

    const { editCourse, course } = useSelector((state) => state.course)
    const [requirement , setRequirement ] = useState("");
    const [requirementList , setRequirementList] = useState([]);



    // useEffect(() => {
    //     register(name, {
    //         required: true,
    //         validate : (value) => value.length > 0
    //     })
    // },[])

    useEffect(() => {
        if (editCourse) {
            setRequirementList(course?.instructions)
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    useEffect(() => {
        setValue(name , requirementList) 
    }, [requirementList]) 



            // Add Tag Function
    const handleAddRequirement = () => {
        if(requirement) {
            setRequirementList([...requirementList , requirement]); //add insert
            setRequirement("");  // empty now
        }
    }
         // Remove Tag Function
    const handleRemoveRequirement = (index) => {
        const updatedRequirements = [...requirementList];
        updatedRequirements.splice(index , 1);
        setRequirementList(updatedRequirements);
    }

    return (

        <div className="flex flex-col space-y-2" >

            <label className="text-sm text-richblack-5"  htmlFor={name}> 
            {label}<sup className="text-pink-200"> * </sup> </label>
            <div className="flex flex-col items-start space-y-2">
                <input
                type = "text"
                id={name}
                value = {requirement} 
                onChange={(e) => setRequirement(e.target.value)}
                className='bg-richblack-800 rounded-md placeholder:text-richblack-200 p-2 
                focus:outline-none shadow-[-1px_-1px_inset_rgba(255,255,250,0.1)] w-full' 
                />
            

                <button 
                    type="button"
                    onClick={handleAddRequirement}
                    className="font-semibold text-yellow-50 " >
                    Add
                </button>
            </div>

            {
                requirementList.length > 0 && (
                    <ul className="mt-2 list-inside list-disc" >
                        {
                            requirementList.map((requirement , index) =>   (
                                <li key={index} className="flex items-center text-richblack-5 "  >        
                                    <span> {requirement}</span>
                                    <button
                                        type="button" 
                                        onClick={() => handleRemoveRequirement (index)}
                                        className="text-xs  text-pure-greys-300 ml-2  ">
                                        clear
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                )
            }

            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200"> 
                    {label} is required </span>
            )}



        </div>
    )
}

export default RequirementField