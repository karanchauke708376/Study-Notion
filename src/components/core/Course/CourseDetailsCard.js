import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaShareSquare } from "react-icons/fa";
import { BsFillCaretRightFill } from "react-icons/bs"
import  copy from 'copy-to-clipboard'
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { addToCart } from "../../../slices/cartSlice";

function CourseDetailsCard({course , setConfirmationModal , handleBuyCourse}) {

    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const {
        thumbnail : ThumbnailImage ,
        price :  CoursePrice ,

    } = course;

    const handlerAddToCard = () => {
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error("You are an Instructor , you can't buy a course ");
            return;
        }

        if(token) {
            console.log("dispatching add to cart")
            dispatch(addToCart(course));
            return;
        }

        setConfirmationModal({

            text1 : "You are not logged in" ,
            text2 : "Please login to add to cart",
            btn1text :  "Login" ,
            btn2text :  "Cancel" ,
            btn1Handler :  () => navigate("/login") ,
            btn2Handler :  () => setConfirmationModal(null) ,
        })

    }

    const handleShare = () => {
        copy(window.location.href); // current url fetch copy
        toast.success("Link Copied to Clipboard . . .");

    }

    return (
        <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
            <img
                src={ThumbnailImage}
                 alt="Thumbnail"
                 className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"     
                       />
            <div className="px-4">
                <div className="space-x-3 pb-4 text-3xl font-semibold">
                    Rs. {CoursePrice}
                </div>

                <div className="flex flex-col gap-4" >
                    <button className="bg-yellow-50 text-black rounded-md w-20 ring-richblack-900"
                        onClick={ 
                            user && course?.studentsEnrolled.includes(user?._id)
                            ? () => navigate("/dashboard/enrolled-courses")
                            : handleBuyCourse

                        } 
                    > 
                        {
                            user && course?.studentsEnrolled.includes(user?._id) ? "Go To Course" : "Buy Now"
                        }
                    </button>

                    {
                        (!user || !course?.studentsEnrolled.includes(user?._id)) && (
                            <button onClick={handlerAddToCard} 
                            className='bg-yellow-25 text-black w-24 rounded-md '
                            > 
                                Add to Cart
                            </button>
                        )
                    }

                </div>

                <div className={``}>
                    <p className="pb-3 pt-6 text-center text-sm text-richblack-25"> 30-Days Moneny-Back Gaurantee </p>
                

                    <p className={`my-2 text-xl font-semibold `}> This Course Includes :  </p>

                    <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                        {
                            course?.instructions?.map((item , index) => {
                                return (
                                    <p className={`flex gap-2`} key={index}>
                                      <BsFillCaretRightFill />
                                      <span>{item}</span>
                                    </p>
                                  )
                                })
                        }

                    </div>   

                 </div>    

                <div className="text-center">
                    <button className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
                    onClick={handleShare} >
                       <FaShareSquare size={25} />
                    </button>
                </div>

            </div>    


        </div>
    )



}

export default CourseDetailsCard