import React, { useEffect, useState } from "react";
import dbService from "../appwrite/database";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";

function Post(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const [err, seterr] = useState(null);
  const [userData, setuserData] = useState(null)
  const [user, setuser] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const watchedFile = watch("file");
  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        setuser(currentUser);
      } catch (error) {
        console.log("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch user data once user is available
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userInfo = await dbService.getUser(user.$id);
        setuserData(userInfo || null);

        if (userInfo?.profilePicture) {
          try {
            const profilePictureUrl = await dbService.getFile(userInfo.profilePicture);
            setuserData((prev) => ({ ...prev, profilePictureUrl }));
          } catch (error) {
            console.log("Error fetching profile picture:", error);
          }
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const Submit = async (data) => {
    if (data.content || (data.file && data.file.length > 0)) {
      try {
        if (data.file.length === 0) {
          const post = await dbService.createPost(data.content, null, user.$id);
          setSuccessMsg("Post created successfully ✅");
          reset();
          setTimeout(() => setSuccessMsg(null), 3000);
          return;
        }
        const file = data.file[0];
        const uploadedFile = await dbService.fileUpload(file);
        if (uploadedFile) {
          const post = await dbService.createPost(
            data.content,
            uploadedFile.$id,
            user.$id
          );
          setSuccessMsg("Post created successfully ✅");
          reset();

          setTimeout(() => setSuccessMsg(null), 3000);
        }
      } catch (error) {
        console.log("Error while creating post", error);
      }
    } else {
      seterr("Please provide content or file");
      setTimeout(() => seterr(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <FaSpinner className="animate-spin text-4xl mr-3" />
        <span className="text-xl font-semibold">Loading post...</span>
      </div>
    );
  }

  return (
    <div>
      {successMsg && (
        <div className="bg-green-100 text-green-700 border px-4 py-2 rounded-md mb-3">
          {successMsg}
        </div>
      )}
      {err && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md mb-3 text-center font-medium">
          {err}
        </div>
      )}
      <form
        onSubmit={handleSubmit(Submit)}
        className="flex gap-3 p-5 border rounded-2xl bg-black border-t-0 border-l-0 border-r-0 border-b-[#2f3336] items-start"
      >
        <div>
          <img
            className="rounded-full w-12"
            src={userData?.profilePictureUrl}
            alt="profile-picture"
          />
        </div>

        <div className="flex flex-col gap-7 pt-2 w-full items-start">
          <input
            type="text"
            placeholder={`Hey ${userData?.name}.. what's happening `}
            {...register("content")}
            className="placeholder:text-gray-500 w-full focus:outline-none focus:ring-0 placeholder:text-xl bg-transparent"
          />
          {errors.content && (
            <span className="text-red-500">{errors.content}</span>
          )}

          <div className="flex w-full justify-between items-center">
            <div className="blueicons flex items-center gap-3">
              <label
                htmlFor="file"
                className="flex items-center gap-1 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="fill-blue-400 w-5"
                >
                  <g>
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                  </g>
                </svg>
                <span className="text-blue-400 font-medium">Media</span>
              </label>
              {watchedFile && watchedFile[0] && (
                <span className="text-green-500 text-sm ml-1">
                  {`${watchedFile[0].name} ✅`}
                </span>
              )}
              <input
                id="file"
                type="file"
                {...register("file")}
                className="hidden"
              />
              {errors.file && (
                <span className="text-red-500">{errors.file}</span>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#787a7a] rounded-full py-2 px-4 font-semibold text-white hover:bg-[#f54122]"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Post;
