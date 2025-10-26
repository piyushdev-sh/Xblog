import React from "react";
import { FaSpinner } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import dbService from "../appwrite/database";
import authService from "../appwrite/auth";
import { useEffect } from "react";
import { useState } from "react";
import PostCard from "../components/PostCard";
import { useForm } from "react-hook-form";

function Profile() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [viewEditProfile, setviewEditProfile] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(true);
 const watchCoverFile = watch("coverPicture");
 const watchProfileFile = watch("profilePicture");
  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setuserData] = useState(null);
  const [posts, setposts] = useState(null);
  const [totalPosts, settotalPosts] = useState(null);
  const [Owner, setOwner] = useState(false);
  useEffect(() => {
    if (watchCoverFile && watchCoverFile[0]) {
      const preview = URL.createObjectURL(watchCoverFile[0]);
      setCoverPreview(preview);
      return () => URL.revokeObjectURL(preview);
    }
  }, [watchCoverFile]);

  useEffect(() => {
    if (watchProfileFile && watchProfileFile[0]) {
      const preview = URL.createObjectURL(watchProfileFile[0]);
      setProfilePreview(preview);
      return () => URL.revokeObjectURL(preview);
    }
  }, [watchProfileFile]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const getCurrentUser = async () => {
          try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser.$id === username) {
              setOwner(true);
            } else {
              setOwner(false);
            }
          } catch (error) {
            console.log("Error fetching current user:", error);
          }
        };
        const fetchUser = async () => {
          const userInfo = await dbService.getUser(username);
          if (!userInfo) {
            setuserData(null);
            return;
          }

          const [profilePictureUrl, coverPictureUrl] = await Promise.all([
            userInfo.profilePicture ? dbService.getFile(userInfo.profilePicture) : null,
            userInfo.coverPicture ? dbService.getFile(userInfo.coverPicture) : null,
          ]);

          setuserData({
            ...userInfo,
            profilePictureUrl: profilePictureUrl,
            coverPictureUrl: coverPictureUrl,
          });
        };
        const fetchPosts = async () => {
          try {
            setLoading(true);
            const postInfo = await dbService.getPostsByUser(username);
            postInfo ? setposts(postInfo.rows) : setposts(null);
            postInfo ? settotalPosts(postInfo.total) : settotalPosts(0);
          } catch (error) {
            console.log("Error fetching posts:", error);
          } finally {
            setLoading(false);
          }
        };
        await getCurrentUser();
        await fetchUser();
        await fetchPosts();
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, username]);
async function Submit(data) {
  try {
    setLoading(true);
    let updatedFields = {};
    if (data.coverPicture && data.coverPicture[0]) {
      const uploadedCover = await dbService.fileUpload(data.coverPicture[0]);
      updatedFields.coverPicture = uploadedCover.$id;
    }
    if (data.profilePicture && data.profilePicture[0]) {
      const uploadedProfile = await dbService.fileUpload(data.profilePicture[0]);
      updatedFields.profilePicture = uploadedProfile.$id;
    }
    if (data.bio && data.bio !== userData.bio) {
      updatedFields.bio = data.bio;
    }
    if (Object.keys(updatedFields).length > 0) {
      await dbService.updateUser(userData.$id, updatedFields);
      if (updatedFields.coverPicture && userData.coverPicture) {
        await dbService.deleteFile(userData.coverPicture);
      }
      if (updatedFields.profilePicture && userData.profilePicture) {
        await dbService.deleteFile(userData.profilePicture);
      }
      console.log("User updated successfully");
    } else {
      console.log("No changes to update");
    }
    setviewEditProfile(false);
    setCoverPreview(null)
    setProfilePreview(null)
    const refreshedUser = await dbService.getUser(userData.$id);
    const [profilePictureUrl, coverPictureUrl] = await Promise.all([
      refreshedUser.profilePicture ? dbService.getFile(refreshedUser.profilePicture) : null,
      refreshedUser.coverPicture ? dbService.getFile(refreshedUser.coverPicture) : null,
    ]);
    setuserData({
      ...refreshedUser,
      profilePictureUrl,
      coverPictureUrl,
    });
  } catch (error) {
    console.log("Error while submitting:", error);
  } finally {
    setLoading(false);
  }
}
    
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <FaSpinner className="animate-spin text-4xl mr-3" />
        <span className="text-xl font-semibold">Loading profile...</span>
      </div>
    );
  }

  return (
    <div>
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
      <div className="cover relative bg-[#333639] w-full h-[200px] object-cover">
        {userData?.coverPictureUrl ? (
          <img
            className="w-full h-full object-cover object-center"
            src={userData?.coverPictureUrl}
            alt="Cover"
          />
        ) : null}
        <img
          className="w-35 absolute bottom-[-70px] left-4 rounded-full outline-2 outline-black"
          src={userData?.profilePictureUrl}
          alt="Profile"
        />
      </div>
      <div className="edit flex justify-end p-4">
        {Owner ? (
          <button
            onClick={() => setviewEditProfile(true)}
            className="border font-semibold border-[#71797b] rounded-3xl py-1 px-5"
          >
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
          <span className="text-sm text-[#71767b] font-medium">
            @{userData?.username}
          </span>
        </div>
        <div className="bio">{userData?.bio}</div>
        <div className="joined flex gap-1 text-[#71767b] font-medium">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="#71767b"
            className="r-4qtqp9 invert w-5 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1bwzh9t r-1gs4q39"
          >
            <g>
              <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
            </g>
          </svg>
          Joined November 2021
        </div>
        <div className="follow flex gap-10">
          <div className="flex font-semibold gap-1">
            218<span className="text-[#71767b] font-medium ">Following</span>
          </div>
          <div className="flex font-semibold gap-1">
            6<span className="text-[#71767b] font-medium">Followers</span>
          </div>
        </div>
      </div>
      <div className="posts">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.$id}
              postId={post.$id}
              time={post.$updatedAt}
              featuredImage={post.featuredImage}
              userId={post.userId}
              content={post.content}
              fileId={post.fileId}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No posts to display.
          </div>
        )}
      </div>
      <div>
        {viewEditProfile ? (
          <div className="fixed inset-0 bg-gray-500/50 z-50  ">
            <div className="absolute inset-0 top-[10vh] mx-auto bg-black/100 w-[41vw] rounded-2xl h-[80vh]">
             <div className="top p-3 flex justify-between ">
              <div className="flex gap-10 justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    setviewEditProfile(false);
                    setCoverPreview(null);
                    setProfilePreview(null);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <h2 className="font-semibold text-2xl">Edit profile</h2>
              </div>
              <button onClick={handleSubmit(Submit)} className="font-medium bg-white text-black rounded-2xl px-4">Save</button>
            </div>
            <form onSubmit={handleSubmit(Submit)}>
              <div className="cover mb-17 relative bg-[#333639] w-full h-[200px] object-cover">
  <label htmlFor="coverPicture" className="w-full h-full cursor-pointer block relative">
    {userData?.coverPictureUrl || coverPreview ? (
      <img
        className="w-full h-full object-cover object-center cursor-pointer"
        src={coverPreview || userData?.coverPictureUrl}
        alt="Cover"
      />
    ) : (
      <div className="w-full h-full"></div>
    )}
    <input
      type="file"
      id="coverPicture"
      accept="image/*"
      className="hidden"
      {...register("coverPicture")}
    />
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="text-white p-3 rounded-full hover:bg-black cursor-pointer transition-colors duration-200">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
        </svg>
      </div>
    </div>
  </label>

  <label htmlFor="profilePicture" className="absolute bottom-[-70px] left-4 w-[140px] h-[140px] rounded-full overflow-hidden cursor-pointer group">
    <img
      className="w-full h-full object-cover rounded-full outline-2 outline-black"
      src={profilePreview || userData?.profilePictureUrl}
      alt="Profile"
    />
    <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50">
      <div className="text-white p-2 rounded-full hover:bg-black transition-colors duration-200">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
        </svg>
      </div>
    </div>
  </label>
  <input type="file" id="profilePicture" accept="image/*" className="hidden" {...register("profilePicture")} />
</div>
            <div className="flex flex-col gap-3 w-full p-5">
              <div className="border border-[#71767b] p-1">
                <div dir="ltr" style={{ color: "rgb(113, 118, 123)" }}>
                  <span className="text-sm px-1">Name</span>
                </div>
                <input
                  type="text"
                  className="focus:outline-none px-1"
                  disabled = {true}
                  id="name"
                  defaultValue={userData?.name}
                  {...register("name")}
                />
              </div>
              <div className="border border-[#71767b] p-1">
                <div dir="ltr" style={{ color: "rgb(113, 118, 123)" }}>
                  <span className="text-sm px-1">Bio</span>
                </div>
                <textarea
                  id="bio"
                  className="focus:outline-none px-1 w-full resize-none"
                  defaultValue={userData?.bio}
                  {...register("bio")}
                ></textarea>
              </div></div>
            </form>
            </div>
           
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Profile;
