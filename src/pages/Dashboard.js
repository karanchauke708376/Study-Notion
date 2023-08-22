import React from "react";
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/core/Dashboard/Sidebar"

const Dashboard = () => {
                        // data nikal liya hai from auth & profile se
    const {loading:authLoading} = useSelector( (state) => state.auth);
    const {loading:profileLoading} = useSelector( (state) => state.profile);
   


    if(profileLoading || authLoading) {
        return(
            <div className="mt-10">
                Loading . . .
            </div>
        )
    }


    return (
        <div className="relative flex  bg-richblack-400 border border-pink-300 ">
            
            <Sidebar/>
                <div className="w-full overflow-auto h-screen">
                <div className="mx-auto w-11/12 max-w-[1000px] py-10 ">
                   <Outlet />
                 </div>
                </div>
                 

        </div>
    )
}

export default Dashboard