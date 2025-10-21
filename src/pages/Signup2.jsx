import React from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { login,logout } from '../app/features/authSlice'
import authService from '../appwrite/auth'
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo'
import Footer from '../components/Footer'


function Signup() {
  const nav = useNavigate();
  const dispatch = useDispatch();
   const { register, handleSubmit, formState: { errors } } = useForm();
   const onSubmit = async (data) => {
    console.log(data);
    try {
      authService.signup(data.email,data.password)
    .then(()=>{
      console.log("Logged in successfully")
      dispatch(login(data))
      nav('/');
    })
    } catch (error) {
      console.log("Error while signing up",error)
    }  
   }
  return (
     <div>
      <form onSubmit={handleSubmit(onSubmit)}>
         <input type='text' placeholder='Enter your name' {...register("name",{required:true})}/>
        {errors.name && <span>{errors.name.message}</span>}
        <input type='email' placeholder='Enter your email' {...register("email",{required:true})}/>
        {errors.email && <span>{errors.email.message}</span>}
         <input type='password' placeholder='Enter your password' {...register("password",{required:true})}/>
        {errors.password && <span>{errors.password.message}</span>}
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default Signup
