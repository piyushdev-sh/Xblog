import { useEffect, useState } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./app/features/authSlice";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import authService from "./appwrite/auth";

function App() {
  const nav = useNavigate();
  const [loggedIn, setloggedIn] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const checkUser = async () => {
      try {
    const res = await authService.getCurrentUser();
    if (res) {
        console.log("User is logged in", res);
        setloggedIn(true);
        dispatch(login(res));
        nav("/home");
    } else {
        console.log("No user found");
        setloggedIn(false);
        nav("/login");
    }
} catch (err) {
    console.error("Error fetching user:", err);
    setloggedIn(false);
    nav("/login");
}
    };
    checkUser();
  }, []);
  return <div className="bg-black w-screen min-h-screen"><Outlet /></div>
}

export default App;
