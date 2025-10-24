import React from "react"
import { useParams, useNavigate } from "react-router-dom";
import dbService from "../appwrite/database";
import authService from "../appwrite/auth";
import { useEffect } from "react";
import { useState } from "react";
import PostCard from "../components/PostCard";

function Profile() {
  const {username} = useParams();
  const navigate = useNavigate();
  const [userData, setuserData] = useState(null)
  const [posts, setposts] = useState(null)
  const [totalPosts, settotalPosts] = useState(null)
  const [Owner, setOwner] = useState(false)
  useEffect(() => {
   try {
    const getCurrentUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if(currentUser.$id === username){
          setOwner(true);
        }else{
          setOwner(false);
        }
      } catch (error) {
        console.log("Error fetching current user:", error);
      }
    }
    getCurrentUser();
    const fetchUser = async () => {
      const userInfo = await dbService.getUser(username);
      userInfo ? setuserData(userInfo) : setuserData(null);
      const profilePictureUrl = await dbService.getFile(userInfo.profilePicture);
      setuserData((prevData) => ({
        ...prevData,
        profilePictureUrl: profilePictureUrl,
      }));
    }
    const fetchPosts = async () => {
      try {
        const postInfo = await dbService.getPostsByUser(username);
        postInfo ? setposts(postInfo.rows) : setposts(null);
        postInfo ? settotalPosts(postInfo.total) : settotalPosts(0);
        
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    }
    fetchUser();
    fetchPosts();
   } catch (error) {
    console.log("Error fetching user data:", error);
   }
  }, [navigate,username])
  
  return (
    <div >
      <div className="top sticky top-0 z-2 bg-black/30 backdrop-blur-xl flex gap-2 ">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="r-4qtqp9 r-yyyyoo w-15 invert p-4 r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-z80fyv r-19wmn03 cursor-pointer"
          style={{ color: "rgb(239, 243, 244)" }}
          onClick={() => navigate(-1)}
        >
          <g>
            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
          </g>
        </svg>
        <div className="name flex justify-center flex-col">
          <h2 className="font-bold text-xl ">{userData?.name}</h2>
          <span className="text-xs text-[#71767b]">{totalPosts} posts</span>
        </div>
      </div>
      <div className="cover relative bg-[#71767b] w-full h-[200px] object-cover">
        <img
          className="w-full h-full object-cover object-center"
          src="https://pbs.twimg.com/profile_banners/1570768600746831872/1755795921/1500x500"
          alt=""
        />

        <img
          className="w-35 absolute bottom-[-70px] left-4 rounded-full outline-2 outline-black"
          src={userData?.profilePictureUrl}
          alt=""
        />
      </div>
      <div className="edit flex justify-end p-4">
        {Owner ? (
          <button className="border font-semibold border-[#71797b] rounded-3xl py-1 px-5">
            Edit profile
          </button>
        ) : (
          <button className=" font-semibold bg-white text-black rounded-3xl py-1 px-5">
            Follow
          </button>
        )}
      </div>
      <div className="detail pl-4 pt-4 gap-2 border border-t-0 border-l-0 border-r-0 border-b-[#2f3336] pb-6 flex flex-col">
        <div className="flex flex-col">
          <h2 className="font-bold text-xl ">{userData?.name}</h2>
          <span className="text-sm text-[#71767b] font-medium" >@{userData?.username}</span>
        </div>
        <div className="bio">{userData?.bio}</div>
        <div className="joined flex gap-1 text-[#71767b] font-medium"><svg viewBox="0 0 24 24" aria-hidden="true" fill="#71767b" className="r-4qtqp9 invert w-5 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1bwzh9t r-1gs4q39"><g><path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path></g></svg>Joined November 2021</div>
        <div className="follow flex gap-10">
          <div className="flex font-semibold gap-1">218<span className="text-[#71767b] font-medium ">Following</span></div>
          <div className="flex font-semibold gap-1">6<span className="text-[#71767b] font-medium">Followers</span></div>
        </div>
      </div>
      <div className="posts">
        {posts && posts.length > 0 ? (
          posts.map((post)=>(
            <PostCard key={post.$id} postId={post.$id} time={post.$updatedAt} featuredImage={post.featuredImage} userId={post.userId} content={post.content} fileId={post.fileId} />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">No posts to display.</div>
          )
        }
      </div>
    </div>
  );
}

export default Profile;
