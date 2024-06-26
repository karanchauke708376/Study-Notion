import "./App.css";
import {Route , Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar"
// import Login from "./components/core/Auth/LoginForm"
// import Signup from "./components/core/Auth/SignupForm"
import Dashboard from "./pages/Dashboard"
import { useState } from "react";
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import ForgotPassword from "./pages/ForgotPassword"
import OpenRoute from "./components/core/Auth/OpenRoute"
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import ContactUs from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Error from "./pages/Error"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import Settings from "./components/core/Dashboard/Settings";
import AddCourse from "./components/core/Dashboard/AddCourse/index";
import NewLogin from "../src/pages/Login.js"
import NewSign from "../src/pages/Signup"
import MyCourses from "./components/core/Dashboard/MyCourses"
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
// import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";

function App() {

  const [isLoggedIn , setIsLoggedIn] = useState(false);

  const { user } = useSelector( (state) => state.profile)


  return (

    <div className="w-screen min-h-screen bg-richblue-900 flex flex-col font-inter">

        {/* inside used , state variable passed , function send */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn = {setIsLoggedIn} />


      <Routes>

        {/* <Route path="/" element={<Home isLoggedIn={setIsLoggedIn}/>} /> */}

        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<NewLogin setIsLoggedIn={setIsLoggedIn} />} /> 
        <Route path="/signup" element={<NewSign setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/forgot-password" element={<OpenRoute> <ForgotPassword />  </OpenRoute> } />
        <Route path="/update-password/:id" element={<OpenRoute> <UpdatePassword />  </OpenRoute> } />
        <Route path="/verify-email" element={<OpenRoute> <VerifyEmail/> </OpenRoute>} />
        <Route path="/about" element={ <About/> } />
        <Route path="/contact" element={ <ContactUs/> } />
        <Route path="/catalog/:catalogName" element={ <Catalog/> } />
        <Route path="/courses/:courseId" element={ <CourseDetails/> } />


        
        
        <Route element={
                  <PrivateRoute > 
                    <Dashboard/> 
                  </PrivateRoute> } > 
               
        <Route path="/dashboard/my-profile" element = {   <PrivateRoute > <MyProfile/> </PrivateRoute> }  />
        <Route path="/dashboard/settings" element = {<Settings />}  />  
      

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>} />
                <Route path="/dashboard/cart" element = {<Cart />}  />

              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element = { <Instructor/> } />
                <Route path="dashboard/add-course" element={<AddCourse/>} />
                <Route path="dashboard/my-courses" element={<MyCourses/>} />
                <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>} />

              </>
            )
          }

          </Route>

        <Route element = {
          <PrivateRoute>
            <ViewCourse/>
          </PrivateRoute>
        }>
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                <Route
                  path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId" 
                  element = { <VideoDetails/> }
                />
                
              </>
            )
          }

        </Route>

        

          
          <Route path="*" element={<Error/>} />
              


      </Routes>    

      

    </div>
   
  )
}

export default App;
