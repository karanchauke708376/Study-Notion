import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Iconbutton from '../../common/Iconbutton'

const MyProfile = () => {

    const {user} = useSelector( (state) => state.profile)
    const navigate = useNavigate();

    return (
        <div className="border  mb-14 text-2xl font-medium text-richblack-5" >
            <h1>My Profile</h1>
 
                {/* Section - 1 */}
            <div className='flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
                <div className='flex items-center gap-x-4'>
                    <img src={user?.image} alt={`profile-${user?.firstName}`} 
                              className='aspect-square w-[78px] rounded-full object-cover'   />
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-richblack-5" >
                             {user?.firstName + "  " + user?.lastName}      </p>
                        <p className="text-sm text-richblack-300"> {user?.email}    </p>
                    </div>
                </div>
                <Iconbutton
                    text="Edit"
                    onclick={() => {
                        navigate("/dashboard/settings");
                    }} > 
                    </Iconbutton>
            </div>

                {/* Section - 2 */}

            <div  className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12" >
                <div className="flex w-full items-center justify-between" >
                    {/* icon add iconbutton */}
                    <p className="text-lg font-semibold text-richblack-5">About</p>  
                    <Iconbutton
                     text="Edit"
                     onclick={() => {
                     navigate("/dashboard/settings")
                    }}  />
                </div>
                <p className={`${
                     
                        user?.additionalDetails?.about
                        ? "text-richblack-5"
                        : "text-richblack-400"
                    } text-sm font-medium`} >
                    {user?. additionalDetails?.about ?? "Write Somethhing about Yourself " }
                     </p>
            </div>

                {/* Section 3 */}

            <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex w-full items-center justify-between">
                    <p className="text-lg font-semibold text-richblack-5">Personal Details </p>
                    <Iconbutton 
                     text="Edit" 
                     onclick={() => {
                     navigate("/dashboard/settings")
                    }}  />
                </div>

                <div className="flex max-w-[500px] justify-between">
                    <div className="flex flex-col gap-y-5">

                        <div>
                            <p className="mb-2 text-sm text-richblack-600"> First Name </p>
                            <p className="text-sm font-medium text-richblack-5"> {user?.firstName} </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-richblack-600"> Email </p>
                            <p  className="text-sm font-medium text-richblack-5"> {user?.email} </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-richblack-600"> Gender </p>
                            <p className="text-sm font-medium text-richblack-5"> {user?.additionalDetails?.gender ?? "Add Gender" }  </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-richblack-600"> Last Name </p>
                            <p className="text-sm font-medium text-richblack-5"> {user?.lastName} </p>
                        </div>

                        <div>
                            <p  className="mb-2 text-sm text-richblack-600"> Phone Number </p>
                            <p className="text-sm font-medium text-richblack-5"> {user?.additionalDetails?.contactNumber ?? "Add Contact Numeber" } </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-richblack-600"> Date Of Birth </p>
                            <p   className="text-sm font-medium text-richblack-5"> {user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth" } </p>
                        </div>
                    
                    </div>    
                 </div>
            </div>

        </div>
    )
}

export default MyProfile