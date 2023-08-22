
import { useSelector } from "react-redux"
import RenderCartCourse from "./RenderCartCourse"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {

    const { tokenItems , total } = useSelector ((state) => state.auth);

    return (
        <div className="text-white">
            <h1> My Wishilist  </h1>
            <p> {tokenItems} Courses in Wishilist  </p>

            {
                total > 0 
                ? (
                <div> 
                    <RenderCartCourse />
                    <RenderTotalAmount />
                </div>  ) :
                  (
                  <p>Your Cart Is Empty</p>
                  )
            }

        </div>
    )
}

 