import style from "../styles/sidebar.module.css";
import icon from "../assets/icon.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";

const Backend_url = import.meta.env.VITE_BACKEND_URL

function Sidebar() {
  const nav = useNavigate();

  const [popupShow, setPopupShow] = useState(false);
  const [popupProp, setPopupProp] = useState({
    msg: "Some Error Occurred",
    isSuccess: false,
  });

  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
       console.log("debug") //debug
      const fetchRes = await fetch(Backend_url+"/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-refresh-token":`${localStorage.getItem('refreshToken')}`
        },
        credentials: "include",
      });
     
      const res = await fetchRes.json();
      

      if (fetchRes.ok) {

        setTimeout(() => {
          nav("/login")
        }, 1000);

        setPopupProp((p) => ({
          ...p,
          msg: res.msg,
          isSuccess: fetchRes.ok,
        }));
        setPopupShow(true);
      }
    } 
    catch (e) {
      setPopupProp((p) => ({
        ...popupProp,
        msg: "Network error",
        isSuccess: false,
      }));
      setPopupShow(true);
    }
  };

  const toggleOpen = () => {
    setOpen(!open);
    console.log(open); //debug
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <>
      {popupShow && <Popup {...popupProp} setPopupShow={setPopupShow} />}

      <div className={style.header}>
        <button className={style.heading} onClick={toggleOpen}>
          Notes
        </button>
      </div>

      {open && <div className={style.backdark} onClick={toggleOpen}></div>}
      <div className={`${style.sidebar} ${open ? style.open : ""}`}>
        <div className={style.imgheader}>
          <div className={style.icon}>
            <img className={style.iconimg} src={icon} />
          </div>
          <p className={style.username}>{`${localStorage.getItem("currentUser")}`}</p>
        </div>
        <button className={style.sidebarbutton} onClick={logoutHandler}>
          Logout
        </button>
        <button className={style.sidebarbutton} onClick={()=>{nav("/")}}>
          Dashboard
        </button>
      </div>
    </>
  );
}

export default Sidebar;
