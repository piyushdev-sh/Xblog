import React from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { login,logout } from '../app/features/authSlice'
import authService from '../appwrite/auth'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
   const { register, handleSubmit, formState: { errors } } = useForm();
   const onSubmit = async (data) => {
   console.log(data);
  try {
    authService.login(data.email,data.password)
    .then(()=>{
      console.log("Logged in successfully")
      dispatch(login(data))
      nav('/home');
    })
  } catch (error) {
    console.log("Error while logging in",error)
  } 
  }
  return (
    <div className="flex relative flex-col min-h-screen">
      <div className="main-container mx-auto mb-30 xl:w-[1280px] w-full px-5 flex-1">
        <div className='flex flex-row gap-3'>
          <div className="logo w-1/2 overflow-hidden justify-center items-center hidden md:flex">
            <Logo w="scale-400" />
          </div>

          <div className="loginRight mx-auto text-white flex flex-col justify-center">
            <h1 className='text-white text-5xl  lg:text-6xl font-bold mt-10 md:mt-30 mb-15 text-[rgb(231, 233, 234)]'>X but not really..</h1>
            <div className='text-2xl mb-2 font-semibold'>Join Today.</div>
            <div className="login my-10">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="innerlogin flex flex-col gap-5">
                  <div className="email flex flex-col gap-1">
                    <label className='font-medium' htmlFor="email">Email</label>
                    <input className='bg-[#1b1b1b] rounded-lg p-2 focus:outline-none ' type='email' placeholder='Enter your email' {...register("email",{required:true})}/>
                    {errors.email && <span className='text-red-500 text-xs '>Email is required</span>}
                  </div>
                  <div className="password flex flex-col gap-1"> 
                    <label className='font-medium' htmlFor="password">Password</label>
                    <input className='bg-[#1b1b1b] rounded-lg p-2 focus:outline-none ' type='password' placeholder='Enter your password' {...register("password",{required:true})}/>
                    {errors.password && <span className='text-red-500 text-xs '>Password is required</span>}
                  </div>
                  <button className='bg-[#f54122] rounded-2xl p-2 cursor-pointer' type='submit'>Login</button>
                </div>
              </form>
            </div>
            <div className="signup w-full flex flex-col gap-3">
              <div className='text-center'>Not a member ?</div>
              <button className='border border-gray-500 w-1/2 rounded-2xl p-2 mx-auto cursor-pointer' onClick={()=>{nav('/signup')}} >Sign in</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login
