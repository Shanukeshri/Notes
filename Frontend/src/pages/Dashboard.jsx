import style from "../styles/dashboard.module.css";
import { useEffect, useState } from "react";
import Sidebar from "../pages/Sidebar";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";

const Backend_url = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const nav = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [popupShow, setPopupShow] = useState(false);
  const [popupProp, setPopupProp] = useState({
    msg: "Some Error Occurred",
    isSuccess: false,
  });

  const [notesArray, setNotesArray] = useState([]);

  const fetchHandler = async () => {
    try {
      const fetchRes = await fetch(Backend_url + "/note", {
        method: "GET",
        credentials: "include",
      });
      const res = await fetchRes.json();
      console.log('res : ',res); //debug
      if (fetchRes.ok) {
        setNotesArray(res.noteArray);
        setLoaded(true);
   
      }

      if (!fetchRes.ok) {
        if (res.msg === "Tokens absent") {
          setTimeout(() => {
            nav("/login");
          }, 1200);
        }
      }

      setPopupProp({
        ...popupProp,
        msg: res.msg || "Loaded",
        isSuccess: fetchRes.ok,
      });
      setPopupShow(true);
    } catch (e) {
      console.log("error : -- ",e);
      setPopupProp({
        ...popupProp,
        msg: "Some Error Occured",
        isSuccess: false,
      });
      setPopupShow(true);
      setTimeout(() => {
        nav("/login");
      }, 1200);
    }
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  return (
    <>
      {popupShow && <Popup {...popupProp} setPopupShow={setPopupShow} />}

      {loaded && (
        <div className={style.body}>
          {notesArray.map((ele) => {
            return (
              <div className={style.note} key={ele._id}>
                <p className={style.title}>{ele.title}</p>
                <p className={style.text}>{ele.body}</p>
                <div></div>
              </div>
            );
          })}
        </div>
      )}

      <button className={style.add}>+</button>

      <Sidebar></Sidebar>
    </>
  );
}

export default Dashboard;
