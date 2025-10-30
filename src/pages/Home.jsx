import { useEffect, useState } from "react";
import authService from "../appwrite/auth";
import dbService from "../appwrite/database";
import { login, logout } from "../app/features/authSlice";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Post from "../components/Post";
import PostCard from "../components/PostCard";
import Feed from "./Feed";
import noDp from "../assets/no_dp.png";
import { useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

function Home() {
  const [showPost, setshowPost] = useState(false)
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [userData, setuserData] = useState(null)
  const [loading, setLoading] = useState(true);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await authService.getCurrentUser();
        console.log(res);
        res ? setuserData(res) : nav("/login"); 
        const userInfo =  await dbService.getUser(res.$id);
        console.log(userInfo);
        userInfo ? setuserData(userInfo) : nav("/login");
        if(userInfo.profilePicture){
          const profilePictureUrl = await dbService.getFile(userInfo.profilePicture);
          setuserData((prevData) => ({
            ...prevData,
            profilePictureUrl: profilePictureUrl,
          }));
        }else{
          setuserData((prevData) => ({
            ...prevData,
            profilePictureUrl: noDp,
          }));
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [nav]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <FaSpinner className="animate-spin text-4xl mr-3" />
        <span className="text-xl font-semibold">Loading home...</span>
      </div>
    );
  }
  
  const handleSubmit = () => {
    try {
      authService.logout().then(() => {
        console.log("Logged out successfully");
        dispatch(logout());
        nav("/login");
      });
    } catch (error) {
      console.log("Error while logging out", error);
    }
  };
  
  return (
    <div className="flex  w-full max-w-[1080px] md:p-2 h-auto mx-auto text-white">
      <div className="left hidden md:w-[25%] sm:flex flex-col relative">
        <div className="logo flex  items-center ">
          <Logo w="w-20 object cover" />
          <h1 className="hidden md:block font-semibold text-3xl">Xblog</h1>
        </div>
        <div className="flex flex-col gap-2">
          <ul className="flex flex-col gap-2">
            <li
              onClick={() => nav("/home")}
              className="invert font-sans flex gap-4 py-2 pr-4 pl-2 ml-4 leading-[24px] items-center font-semibold text-xl w-fit hover:bg-gray-200 hover:rounded-full "
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 r-4qtqp9 invert r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
                fill={isActive("/home") ? "white" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
              </svg>
              <span className="hidden text-black md:block">Home</span>
            </li>
            <li className="invert font-sans flex gap-4 py-2 pr-4 pl-2 ml-4 leading-[24px] items-center text-xl w-fit hover:bg-gray-200 hover:rounded-full">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 r-4qtqp9 invert r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
                fill={isActive("/home/explore") ? "white" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="hidden text-black md:block">Explore</span>
            </li>
            <li className="invert font-sans flex gap-4 py-2 pr-4 pl-2 ml-4 leading-[24px] items-center text-xl w-fit hover:bg-gray-200 hover:rounded-full">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 r-4qtqp9 invert r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
                fill={isActive("/home/bookmarks") ? "white" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
              </svg>
              <span className="hidden text-black md:block">Bookmarks</span>
            </li>
            <li onClick={()=> nav(`/home/profile/${userData?.username}`)} className="invert font-sans flex gap-4 py-2 pr-4 ml-4 pl-2 leading-[24px] items-center text-xl w-fit hover:bg-gray-200 hover:rounded-full">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 r-4qtqp9 invert r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
                fill={isActive(`/home/profile/${userData?.username}`) ? "white" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19z"></path>
              </svg>
              <span className="hidden text-black md:block">Profile</span>
            </li>
          </ul>
          <div className="w-[87%] flex justify-center items-center">
            <button
              onClick={() => {
                if (showPost) {
                  setshowPost(false);
                  nav(-1);
                } else {
                  nav("/home/post");
                  setshowPost(true);
                }
              }}
              className="bg-white text-black w-full rounded-full h-13 font-bold hidden md:block"
            >
              {showPost ? (
                <span className="flex items-center justify-center gap-2">
                  <span>Cancel</span>
                  <span className="text-red-500 text-3xl leading-none">&times;</span>
                </span>
              ) : (
                "Post"
              )}
            </button>
            <div
              dir="ltr"
              className="md:hidden cursor-pointer ml-4"
              onClick={() => {
                if (showPost) {
                  setshowPost(false);
                  nav(-1);
                } else {
                  nav("/home/post");
                  setshowPost(true);
                }
              }}
            >
              {showPost ? (
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200">
                  <span className="text-red-500 text-2xl leading-none">&times;</span>
                </div>
              ) : (
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-5 h-5 invert"
                    fill="currentColor"
                  >
                    <g>
                      <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
                    </g>
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-[87%] absolute bottom-3">
            <button className="bg-[#f54122] text-white w-full rounded-full h-13 font-bold hidden md:block" onClick={handleSubmit}>
              Logout
            </button>
            <div onClick={()=> nav(`/home/profile/${userData?.username}`)} className=" flex text-white items-center py-2 pr-4 pl-2 gap-3 hover:bg-gray-900 hover:rounded-full">
              <img
                className="w-10 rounded-full"
                src={userData?.profilePictureUrl}
                alt=""
              />
              <div className="flex-col text-white hidden md:flex">
                <span className="font-semibold">{userData?.name}</span>
                <span className="text-gray-500">@{userData?.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="sm:hidden z-50 bg-black/30 backdrop-blur-xl flex justify-between w-full fixed left-0 bottom-0 py-4 px-5 ">
        <svg onClick={() => nav("/home")} viewBox="0 0 24 24" aria-hidden="true" className="w-7 cursor-pointer" fill={isActive("/home") ? "white" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
        </svg>

        <svg onClick={() => nav("/home/explore")} viewBox="0 0 24 24" aria-hidden="true" className=" w-7 cursor-pointer" fill={isActive("/home/explore") ? "white" : "none"} stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <svg onClick={() => nav("/home/bookmarks")} viewBox="0 0 24 24" aria-hidden="true" className=" w-7 cursor-pointer" fill={isActive("/home/bookmarks") ? "white" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
        </svg>

        <svg onClick={() => nav(`/home/profile/${userData?.username}`)} viewBox="0 0 24 24" aria-hidden="true" className=" w-7 cursor-pointer" fill={isActive(`/home/profile/${userData?.username}`) ? "white" : "none"} stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19z"></path>
        </svg>
      </div>

      <div
        className={`right relative overflow-auto border-[#2f3336] ${
          isActive("/home") ? "pt-15" : "pt-0"
        } pb-20 border-b-0 border-t-0 w-full md:w-[75%] h-screen overflow-x-hidden scroll-smooth border`}
      >
        {/* Header for Mobile - Visible only on Home page */}
        {isActive("/home") && (
          <div className="sm:hidden fixed top-0 left-0 w-full bg-black/30 backdrop-blur-xl flex justify-center items-center gap-3 px-5 py-3 z-50">
            <div className="overflow-hidden"><Logo w="scale-200 w-10" /></div>
            <h1 className="font-semibold text-xl text-white">Xblog</h1>
          </div>
        )}
        <Outlet/>
      </div>
    </div>
  );
}

export default Home;
