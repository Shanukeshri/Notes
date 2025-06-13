import style from "../styles/dashboard.module.css";
import { useEffect, useState } from "react";
import Sidebar from "../pages/Sidebar";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import fetchHandler from "../handlers/fetchHandler";
import addHandler from "../handlers/addHandler";

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

  useEffect(() => {
    setTimeout(() =>
      fetchHandler(
        nav,
        setNotesArray,
        setLoaded,
        popupProp,
        setPopupProp,
        setPopupShow
      ),0
    );
  }, []);

  const onAddClick = () => {
    addHandler(nav);
  };

  const noteOpener = (_id)=>{
    nav('/editor' , {state:{_id}})
  }

  return (
    <>
      {popupShow && <Popup {...popupProp} setPopupShow={setPopupShow} />}

      {loaded && (
        <div className={style.body}>
          {notesArray.map((ele) => {
            return (
              <div className={style.note} key={ele._id} onClick={() =>{noteOpener(ele._id)}}>
                <p className={style.title}>{ele.title}</p>
                <p className={style.text}>{ele.body.length>40?ele.body.slice(0,40)+"...":ele.body}</p>
                <div></div>
              </div>
            );
          })}
        </div>
      )}

      <button className={style.add} onClick={onAddClick}>
        +
      </button>

      <Sidebar></Sidebar>
    </>
  );
}

export default Dashboard;
