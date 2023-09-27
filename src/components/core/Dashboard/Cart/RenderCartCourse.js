import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import ReactStars from "react-rating-stars-components"
import ReactStars from "react-stars"
import { BsStarFill , BsStar} from "react-icons/bs"
import { RiDeleteBin6Line }  from "react-icons/ri"  
import { removeFromCart } from "../../../../slices/cartSlice"

const RenderCartCourse = () => {

    const {cart} = useSelector( (state) => state.cart);
    const dispatch = useDispatch();  


    return (

        <div>

            {
                cart.map((course , index) => {
                    <div>
                        <div>
                            <img src={course?.thumbnail}  alt="pic"/>
                            <div> 
                                <p>{course?.courseName}</p>
                                <p>{course?.category?.name} </p>
                                <div>  
                                     {/* // getAverangeAPI Connect Here */}
                                     <span> 4.8 </span>

                                     <ReactStars 
                                            count = {5}
                                            size = {20}
                                            edit = {false}
                                            activeColor = "#ffd700"
                                            emptyIcon = {<BsStar/>}
                                            fullIcon = {<BsStarFill/>}
                                     />

                                     <span> {course?.ratingAndReviews?.length} Review Count  </span>

                                </div>  
                            </div> 
                        </div>

                        <div> 
                            <button onClick={() => dispatch(removeFromCart(course._id))} >
                                <RiDeleteBin6Line /> 
                                <span> Remove </span>
                            </button>

                            <p>Rs. {course?.price}</p>

                        </div>


                    </div>
                })
            }

        </div>
    )
}

export default RenderCartCourse