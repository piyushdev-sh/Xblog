import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../app/features/authSlice";
import authService from "../appwrite/auth";
import dbService from "../appwrite/database";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

function Signup() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  const usernameValue = watch("username");

  useEffect(() => {
    if (!usernameValue) {
      setIsAvailable(null);
      setLoading(false);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const userRow = await dbService.getUser(usernameValue);
        setIsAvailable(userRow);
      } catch (err) {
        setIsAvailable(true);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [usernameValue]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      authService.signup(data.email, data.password, data.username).then(() => {
        console.log("Logged in successfully");
        authService.login(data.email, data.password).then(() => {
          console.log("Logged in successfully");
          dbService
            .createUser(data.username, data.email, data.name)
            .then(() => {
              dispatch(login(data));
              nav("/home");
            });
        });
      });
    } catch (error) {
      console.log("Error while signing up", error);
    }
  };
  return (
    <div>
      <div className="flex gap-3">
        <div className="logo">
          <Logo w="w-[720px] h-[778px] object-cover" />
        </div>
        <div className="loginRight mx-auto text-white">
          <h1 className="text-white text-6xl font-bold mt-10 mb-15 text-[rgb(231, 233, 234)]">
            X but not really..
          </h1>
          <div className="text-2xl mb-2 font-semibold">
            Create your account.
          </div>
          <div className="login my-10 w-100">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="innerlogin flex flex-col gap-5">
                <div className="name flex flex-col gap-1">
                  <label className="font-medium" htmlFor="name">
                    Name{" "}
                    {errors.name && (
                      <span className="text-red-500 text-xs ">
                        * Name is required
                      </span>
                    )}{" "}
                  </label>
                  <input
                    className="bg-[#1b1b1b] rounded-lg p-2 focus:outline-none "
                    type="text"
                    placeholder="Enter your name"
                    {...register("name", { required: true })}
                  />
                </div>
                <div className="username flex flex-col gap-1">
                  <label className="font-medium" htmlFor="username">
                    Username{" "}
                    {errors.username && (
                      <span className="text-red-500 text-xs">
                        *Username is required
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      className="bg-[#1b1b1b] w-full rounded-lg p-2 focus:outline-none"
                      type="text"
                      placeholder="Choose a username"
                      {...register("username", { required: true })}
                    />
                    <span className="absolute right-3 top-2">
                      {loading && <span>⏳</span>}
                      {!loading && isAvailable === true && (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      )}
                      {!loading && isAvailable === false && (
                        <FaTimesCircle className="text-red-500 text-xl" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="email flex flex-col gap-1">
                  <label className="font-medium" htmlFor="email">
                    Email{" "}
                    {errors.email && (
                      <span className="text-red-500 text-xs ">
                        *Email is required
                      </span>
                    )}
                  </label>
                  <input
                    className="bg-[#1b1b1b] rounded-lg p-2 focus:outline-none "
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: true })}
                  />
                </div>
                <div className="password flex flex-col gap-1">
                  {" "}
                  <label className="font-medium" htmlFor="password">
                    Password
                    {errors.password && (
                      <span className="text-red-500 text-xs ">
                        *Password is required
                      </span>
                    )}
                  </label>
                  <input
                    className="bg-[#1b1b1b] rounded-lg p-2 focus:outline-none "
                    type="password"
                    placeholder="Create your password"
                    {...register("password", { required: true })}
                  />
                </div>
                <button
                  className="bg-[#f54122] rounded-2xl p-2 cursor-pointer"
                  type="submit"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
          <div className="signup w-100 flex flex-col gap-3">
            <div className="text-center text-gray-400">
              Already have a account ?
            </div>
            <button
              className="border border-gray-500 w-50 rounded-2xl p-2 mx-auto cursor-pointer"
              onClick={() => {
                nav("/login");
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
