import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidDownArrow } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import SubSectionModal from "./SubSectionModal";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  console.log(course , "Course Data ");

  // 3 flag used
  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);

  // store modal data
  const [confirmationModal, setconfirmationModal] = useState(null);


  const handleDeleteSection =  async(sectionId) => { 
    try{

   
    const result = await deleteSection(
      { sectionId ,
      courseId : course._id } ,
      token ,
    )

    console.log("Printing After Delete Section" , result);
    if(result) {
      dispatch(setCourse(result))
    }
    setconfirmationModal(null); // close confirmationModal
  }
  catch(error) {
     console.log("error in  45", error);
     }

  }

  const handleDeleteSubSection = async  (subSectionId, sectionId) => {
    const result = await deleteSubSection({subSectionId , sectionId},token);
    
    if(result) {
      const updatedCourseContent = course.courseContent.map((section) => 
          section._id === sectionId ? result : section);
          const updatedCourse = {...course , courseContent : updatedCourseContent};
          dispatch(setCourse(updatedCourse));
    }
    setconfirmationModal(null);

  }

  return (
    <div>
      <div className="rounded-lg bg-richblack-700 p-6 text-white px-8">
        {course?.courseContent?.map((section) => {
            return <details key={section._id} open >
            
            <summary className=" flex items-center justify-between gap-x-3 border-b-2 ">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu />
                <p>{section.sectionName}</p>
              </div>

              <div className="flex items-center gap-x-3 ">
                <button
                  onClick={() => {
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }}
                >
                  <MdEdit />
                </button>

                <button
                  onClick={() => {
                    setconfirmationModal({
                      text1: "Delete This Section",
                      text2: "All The lectures in this section will be deleted ",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setconfirmationModal(null),
                    });
                  }}
                >
                  <RiDeleteBin6Line />
                </button>

                <span> | </span>
                <BiSolidDownArrow className={`text-xl  text-richblack-300`} />
              </div>
            </summary>

            <div>
              {section?.subSection?.map((data) => ( 
              <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex items-center justify-between gap-x-3 border-b-2"
                >
                  <div className="flex items-center gap-x-3">
                    <RxDropdownMenu />
                    <p>{data.title}</p>
                  </div>

                  {/* propergation stop */}
                  <div onClick={(e) => e.isPropagationStopped()}
                  className="flex items-center gap-x-3">

                    <button
                      onClick={(e) => 
                        { 
                          e.stopPropagation();
                          setEditSubSection({ ...data, sectionId: section._id })
                        }
                       
                      }
                    >
                      <MdEdit />
                    </button>

                    <button
                      onClick={(e) =>{
                        e.stopPropagation();
                        setconfirmationModal({
                          text1: "Delete This Sub Section",
                          text2: "Selected Lecture Will Be Deleted ",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setconfirmationModal(null),
                        })}
                      }
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>))
              }

              <button
                onClick={() => setAddSubSection(section._id)}
                className="mt-4 flex items-center gap-x-2 text-yellow-50"
              >
                <AiOutlinePlus />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>;
        })}
      </div>

      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <div></div>
      )}

      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default NestedView;
