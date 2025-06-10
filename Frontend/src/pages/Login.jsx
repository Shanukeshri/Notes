import "../styles/login.css";
import icon from "../assets/icon.png";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import { useState } from "react";

const Backend_url = import.meta.env.VITE_BACKEND_URL


function Login() {
  const nav = useNavigate();

  const [popupShow, setPopupShow] = useState(false);

  const [popupProp, setPopupProp] = useState({
    msg: "Some Error Occurred",
    isSuccess: false,
  });

  const [formData, setData] = useState({
    username: "",
    password: "",
  });

  const changeHandler = (e) => {
    setData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    try {
      const fetchRes = await fetch(Backend_url+"/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await fetchRes.json();

      //response handling
      setPopupShow(true);
      setPopupProp({
        ...popupProp,
        msg: res.msg,
        isSuccess: fetchRes.ok,
      });

      if (fetchRes.ok) {
        setTimeout(()=>{
          nav("/");
        },1000)
      } 
    } catch (e) {
      console.log("error : -- ",e)
      setPopupShow(true);
      setPopupProp({
        ...popupProp,
        msg: "Network Error",
        isSuccess: false,
      });
    }
  };

  return (
    <>
      {popupShow && <Popup {...popupProp} setPopupShow={setPopupShow} />}

      <div className="headerflex">
        <div className="iconholder">
          <img className="iconimg" src={icon} />
        </div>
        <p className="headingtext">Login To Cloud Editor</p>
      </div>

      <div className="usrnmpswd">
        <div className="inputflex">
          <input
            name="username"
            value={formData.username}
            className="usnminput"
            placeholder="Username"
            onChange={changeHandler}
          ></input>
          <input
            name="password"
            value={formData.password}
            type="password"
            className="usnminput"
            placeholder="Password"
            onChange={changeHandler}
          ></input>
        </div>
        <p className="belowText">
          Don't have an account?{" "}
          <span className="clickableText" onClick={() => nav("/register")}>
            Register...{" "}
          </span>
        </p>
        <button className="loginbutton" onClick={submitHandler}>Log In</button>
      </div>
    </>
  );
}
export default Login;
