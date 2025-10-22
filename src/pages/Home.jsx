import { useEffect, useState } from "react";
import authService from "../appwrite/auth";
import dbService from "../appwrite/database";
import { login, logout } from "../app/features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Post from "../components/Post";
import PostCard from "../components/PostCard";
import Feed from "./Feed";

function Home() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [userData, setuserData] = useState(null)
  useEffect(() => {
    const fetchUser = async () => {
      const res = await authService.getCurrentUser();
      console.log(res);
      res ? setuserData(res) : nav("/login"); 
      const userInfo =  await dbService.getUser(res.$id);
      console.log(userInfo);
      userInfo ? setuserData(userInfo) : nav("/login");
    };
    fetchUser();
  }, [nav]);
  
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
    <div className="flex w-[75vw] h-auto mx-auto text-white">
      <div className="left w-[25%] flex flex-col">
        <div className="logo flex  items-center ">
          <Logo w="w-20 object cover" />
          <h1 className="font-semibold text-3xl">Xblog</h1>{" "}
        </div>
        <div className="flex flex-col gap-2">
          <ul className="flex flex-col gap-2">
            <li className="invert font-sans flex gap-4 py-2 pr-4 pl-2 ml-4 leading-[24px] items-center font-semibold text-xl w-fit hover:bg-gray-200 hover:rounded-full ">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
              >
                <g>
                  <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
                </g>
              </svg>
              <span className="hidden text-black xl:block">Home</span>
            </li>
            <li className="invert font-sans flex gap-4 py-2 pr-4 pl-2 ml-4 leading-[24px] items-center text-xl w-fit hover:bg-gray-200 hover:rounded-full">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
              >
                <g>
                  <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                </g>
              </svg>
              <span className="hidden text-black xl:block">Explore</span>
            </li>
            <li className="invert font-sans flex gap-4 py-2 pr-4 pl-2 ml-4 leading-[24px] items-center text-xl w-fit hover:bg-gray-200 hover:rounded-full">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
              >
                <g>
                  <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
                </g>
              </svg>
              <span className="hidden text-black xl:block">Bookmarks</span>
            </li>
            <li className="invert font-sans flex gap-4 py-2 pr-4 ml-4 pl-2 leading-[24px] items-center text-xl w-fit hover:bg-gray-200 hover:rounded-full">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-7 r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e"
              >
                <g>
                  <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                </g>
              </svg>
              <span className="hidden text-black xl:block">Profile</span>
            </li>
          </ul>
          <button className="bg-white text-black w-[87%] rounded-full h-13 font-bold hidden xl:block">
            Post
          </button>

          <div className="flex flex-col gap-2 absolute bottom-3">
            <button className="bg-[#f54122] text-white w-full rounded-full h-13 font-bold hidden xl:block" onClick={handleSubmit}>
              Logout
            </button>
            <div className=" flex text-white items-center py-2 pr-4 pl-2 gap-3 hover:bg-gray-900 hover:rounded-full">
              <img
                className="w-10 rounded-full"
                src="https://pbs.twimg.com/profile_images/1814599205828108288/B1nEe-QQ_400x400.jpg"
                alt="profile-picture"
              />
              <div className="flex-col text-white hidden xl:flex">
                <span className="font-semibold">{userData?.name}</span>
                <span className="text-gray-500">@{userData?.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="right overflow-auto border-[#2f3336] pb-10 border-b-0 border-t-0 w-[75%] h-screen overflow-x-hidden scroll-smooth  border">
       
       <Post/>
      <Feed/>
      </div>
    </div>
  );
}

export default Home;
