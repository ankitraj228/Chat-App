import React, { useEffect, useState } from "react";
import "./App.css";
import MainContainer from "./Components/MainContainer";
import Login from "./Components/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import Welcome from "./Components/Welcome";
import ChatArea from "./Components/ChatArea";
import Users from "./Components/Users";
import CreateGroups from "./Components/CreateGroups";
import Groups from "./Components/Groups";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const location = useLocation();
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Show notification every 1 hour (3600000 milliseconds)
      toast("You have been using the app for over 1 hour.");
    }, 3600000);
  
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Reset start time when location changes
    setStartTime(Date.now());
  }, [location]);

  return (
    <div className={"App" + (lightTheme ? "" : "-dark")}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="app" element={<MainContainer />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="chat/:_id" element={<ChatArea />} />
          <Route path="users" element={<Users />} />
          <Route path="groups" element={<Groups />} />
          <Route path="create-groups" element={<CreateGroups />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
