import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData : null,
    loggedIn : false,
  },
  reducers:{
    login : (state,action)=>{
        state.userData = action.payload
        state.loggedIn = true
    },
    logout : (state)=>{
        state.userData = null
        state.loggedIn = false
    }
    }})

 export const {login,logout}   = authSlice.actions
 export default authSlice.reducer