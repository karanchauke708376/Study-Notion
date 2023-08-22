import React, { useEffect, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { toast } from "react-hot-toast";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";

const Navbar = (props) => {
  // console.log("Printing base url: ",process.env.REACT_APP_BASE_URL);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // const fetchSublinks = async() => {

  //     try {   // api call
  //             const result = await apiConnector("GET", categories.CATEGORIES_API);
  //             // console.log("Printing Sublinks result : " , result);
  //             setSublinks(result.data.data);

  //         } catch(error) {
  //             console.log("Could not fetch the category list")
  //         }
  // }

  // useEffect( () => {

  //     // console.log("PRINTING TOKEN", token);
  //     fetchSublinks();

  // },[])

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        // console.log( res.data);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  let isLoggedIn = props.isLoggedIn;
  let setIsLoggedIn = props.setIsLoggedIn;

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex justify-between items-center w-11/12 max-w-[1160px] py-4 mx-auto">
      <Link to="/">
        {" "}
        <img
          src={logo}
          alt="logo"
          width={160}
          height={32}
          loading="lazy"
        />{" "}
      </Link>

      <nav>
        <ul className="flex text-white gap-x-6">
          {NavbarLinks.map((link, index) => (
            <li key={index}>
              {link.title === "Catalog" ? (
                <div className=" relative flex items-center gap-2 group ">
                  <p>{link.title}</p>
                  <MdOutlineKeyboardDoubleArrowDown />

                  <div
                    className="invisible absolute left-[50%] 
                                        translate-x-[-50%]  z-10 translate-y-[25%]
                                        top-[50%] flex
                                        flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 
                                        opacity-0 transition-all duration-200 group-hover:visible 
                                        group-hover:opacity-100 lg:w-[300px]    "
                  >
                    <div className="absolute left-[50%] top-0 h-6 w-6 rotate-45 rounded bg-richblack-5 translate-y-[-50%] translate-x-[80%] "></div>

                    {/* {
                                                    subLinks.length ? (
                                                        
                                                            subLinks.map( (subLink , index) => (
                                                                <Link to={`${subLink.link}`} key={index} >
                                                                <p>{subLink.title}</p>
                                                                </Link>
                                                            ))
                                                        
                                                    ) : (<div></div>)
                                        } */}

                    {subLinks
                      ?.filter((subLink) => subLink?.courses?.length > 0)
                      ?.map((subLink, i) => (
                        <Link
                          to={`/catalog/${subLink.name
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`}
                          className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50 text-black"
                          key={i}
                        >
                          <p>{subLink.name}</p>
                        </Link>
                      ))}
                  </div>
                </div>
              ) : (
                <Link to={link?.path}>
                  <p
                    className={`${
                      matchRoute(link?.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    {link.title}
                  </p>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Login - Signup - Logout - Dashboard  Button */}

      {!token && (
        <div className="flex items-center gap-x-4">
          {!isLoggedIn && (
            <Link to="/Login">
              <button
                className="bg-richblack-800 text-white py-[8px] px-[12px]
                             rounded-[8px] border border-richblack-700"
              >
                Log in
              </button>
            </Link>
          )}

          {!isLoggedIn && (
            <Link to="/signup">
              <button
                className="bg-richblack-800 text-white py-[8px] px-[12px]
                             rounded-[8px] border border-richblack-700"
              >
                {" "}
                Sign-Up
              </button>
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/">
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  toast.success("Logged Out!");
                }}
                className="bg-richblack-800 text-white py-[8px] px-[12px]
                            rounded-[8px] border border-richblack-700"
              >
                {" "}
                Log-Out
              </button>
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/dashboard">
              <button
                className="bg-richblack-800 text-white py-[8px] px-[12px]
                             rounded-[8px] border border-richblack-700"
              >
                Dashboard
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Login/SignUp/Dashboard */}
      <div className="flex gap-x-4 items-center">
        {user && user?.accountType !== "Instructor" && (
          <Link to="/dashboard/cart" className="relative text-white">
            <AiOutlineShoppingCart size={20} color="white" />
            {totalItems > 0 && <span>{totalItems}</span>}
          </Link>
        )}

        {token === null && <Link to="/login"></Link>}

        {token === null && <Link to="/signup"></Link>}

        {token !== null && <ProfileDropDown />}
      </div>
    </div>
  );
};

export default Navbar;
