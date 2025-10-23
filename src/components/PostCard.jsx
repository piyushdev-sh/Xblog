import React, { useEffect, useState } from "react";
import dbService from "../appwrite/database";
import { useNavigate } from "react-router-dom";

function PostCard({ userId, content, featuredImage, time }) {
const nav = useNavigate()
  const [fileUrl, setfileUrl] = useState(null);
const [fullscreen, setFullscreen] = useState(null);
const [userData, setuserData] = useState(null)
const [timeAgo, settimeAgo] = useState(null)
  useEffect(() => {
  const getTimeAgo = (updatedAt) => {
  const updatedDate = new Date(updatedAt);
  const now = new Date();

  const diffMs = now - updatedDate;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes <= 1 ? "just now" : `${diffMinutes}m`;
  } 
  else if (diffHours < 24) {
    return `${diffHours}h`;
  } 
  else if (diffDays < 7) {
    return `${diffDays}d`;
  } 
  else {
    return updatedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }); // e.g. "22 Oct 2025"
  }
}
settimeAgo(getTimeAgo(time))
    const fetchData = async () => {
      if (featuredImage) {
        try {
          const file = await dbService.getFile(featuredImage);
          file ? setfileUrl(file) : setfileUrl(null);
        } catch (error) {
          console.error("Error fetching file:", error);
          setfileUrl(null);
        }
      } else {
        setfileUrl(null);
      }
    const fetchUserData = async () => {
      try {
        const userInfo =  await dbService.getUser(userId);
        console.log(userInfo);
        userInfo ? setuserData(userInfo) : setuserData(null);
        if(userInfo.profilePicture){
          const profilePictureUrl = await dbService.getFile(userInfo.profilePicture);
          setuserData((prevData) => ({
            ...prevData,
            profilePictureUrl: profilePictureUrl,
          }));
        }

      } catch (error) {
        console.log("Error while fetching user data", error); 
      }
    }
    fetchUserData();
    };
    fetchData();
  }, []);
  const deletePost = async () => {
    try {
      const deleted = await dbService.deletePost(postId);
    } catch (error) {
      
    }
  }
  return (
    <div>
        {fullscreen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 transition focus:outline-none z-10"
              onClick={() => setFullscreen(null)}
              aria-label="Close fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={fullscreen} alt="" className="max-h-full max-w-full object-contain" />
          </div>
        )}
    <div className="post w-full border border-t-0 border-l-0 border-r-0 border-b-[#2f3336]">
      <div className="flex gap-2 p-2 items-start w-full">
        <img
          className="rounded-full w-10"
          src={userData?.profilePictureUrl}
          alt="profile-picture"
          onClick={()=> nav(`/home/profile/${userData?.username}`)}
        />
        <div className="w-[90%] flex flex-col">
          <div className="flex justify-between w-full">
            <div onClick={()=> nav(`/home/profile/${userData?.username}`)} className="text-white flex items-center gap-1 font-semibold">
              {userData ? userData.name : "Unknown User"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22 22"
                className="w-4"
              >
                <path
                  d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                  fill="#1d9bf0"
                />
              </svg>
              <span className="text-gray-500 font-light text-sm">
                @{userData?.username} • {timeAgo}
              </span>
            </div>
              <button
                onClick={deletePost}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 7a1 1 0 011-1h10a1 1 0 011 1v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7zm3 2a1 1 0 00-1 1v7a1 1 0 102 0v-7a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v7a1 1 0 102 0v-7a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                  <path d="M4 5h16v2H4V5z" />
                </svg>
              </button>
          </div>
          <span className="text-white font-sans text-[15px]">{content}</span>
          {fileUrl && (
            <div
              className="relative mt-2 mb-2 w-full h-100 bg-black  overflow-hidden rounded-2xl cursor-pointer"
              onClick={() => setFullscreen(fileUrl)}
            >
              <img
                src={fileUrl}
                alt=""
                className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
              />
            </div>
          )}
          <div className="flex justify-between gap-2 min-[500px]:gap-10 pr-2">
            <div className="flex justify-between w-full">
              <div className="text-gray-500 flex font-light text-sm gap-1">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="fill-gray-500 w-5"
                >
                  <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                </svg>
                700
              </div>
            </div>
            <div className="text-gray-500 flex font-light text-sm gap-2">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="fill-gray-500 w-5"
              >
                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div></div>
  );
}

export default PostCard;
