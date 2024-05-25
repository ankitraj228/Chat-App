
import React, { useEffect, useState } from "react";
import logo from "../Images/logo1.png";
import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toaster from "./Toaster";

function Login() {
  const [showlogin, setShowLogin] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [logInStatus, setLogInStatus] = useState("");
  const [signInStatus, setSignInStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginTime = () => {
      const lastLoginTime = localStorage.getItem("lastLoginTime");
      if (lastLoginTime) {
        const diff = new Date() - new Date(lastLoginTime);
        const hours = Math.floor(diff / 3600000);

        if (hours >= 3) {
          navigate("/");
        }

        const loginDay = new Date(lastLoginTime).getDate();
        const currentDay = new Date().getDate();
        const isNextDay = currentDay > loginDay;
        const nextDayDate = new Date();
        nextDayDate.setDate(nextDayDate.getDate() + 1);
        nextDayDate.setHours(6, 0, 0, 0); // Set to 6 AM next day

        if (new Date() < nextDayDate) {
          navigate("/");
        }
      }
    };

    const intervalId = setInterval(checkLoginTime, 60000); // Check every minute
    checkLoginTime(); // Check immediately after component mounts

    return () => clearInterval(intervalId);
  }, []);

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:8080/user/login/",
        data,
        config
      );
      setLogInStatus({ msg: "Success", key: Math.random() });
      localStorage.setItem("userData", JSON.stringify(response));
      localStorage.setItem("lastLoginTime", new Date());
      navigate("/app/welcome");
    } catch (error) {
      setLogInStatus({
        msg: "Invalid User name or Password",
        key: Math.random(),
      });
    }
    setLoading(false);
  };

  const signUpHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:8080/user/register/",
        data,
        config
      );
      setSignInStatus({ msg: "Success", key: Math.random() });
      navigate("/app/welcome");
      localStorage.setItem("userData", JSON.stringify(response));
      localStorage.setItem("lastLoginTime", new Date());
    } catch (error) {
      if (error.response.status === 405) {
        setLogInStatus({
          msg: "User with this email ID already Exists",
          key: Math.random(),
        });
      }
      if (error.response.status === 406) {
        setLogInStatus({
          msg: "User Name already Taken, Please take another one",
          key: Math.random(),
        });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="login-container">
        <div className="image-container">
          <img src={logo} alt="Logo" className="welcome-logo" />
        </div>
        {showlogin && (
          <div className="login-box">
            <p className="login-text">Login to your Account</p>
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter User Name"
              variant="outlined"
              color="secondary"
              name="name"
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  loginHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              color="secondary"
              name="password"
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  loginHandler();
                }
              }}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={loginHandler}
            >
              Login
            </Button>
            <p>
              Don't have an Account ?{" "}
              <span
                className="hyper"
                onClick={() => {
                  setShowLogin(false);
                }}
              >
                Sign Up
              </span>
            </p>
            {logInStatus ? (
              <Toaster key={logInStatus.key} message={logInStatus.msg} />
            ) : null}
          </div>
        )}
        {!showlogin && (
          <div className="login-box">
            <p className="login-text">Create your Account</p>
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter User Name"
              variant="outlined"
              color="secondary"
              name="name"
              helperText=""
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  signUpHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter Email Address"
              variant="outlined"
              color="secondary"
              name="email"
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  signUpHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              color="secondary"
              name="password"
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  signUpHandler();
                }
              }}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={signUpHandler}
            >
              Sign Up
            </Button>
            <p>
              Already have an Account ?
              <span
                className="hyper"
                onClick={() => {
                  setShowLogin(true);
                }}
              >
                Log in
              </span>
            </p>
            {signInStatus ? (
              <Toaster key={signInStatus.key} message={signInStatus.msg} />
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
