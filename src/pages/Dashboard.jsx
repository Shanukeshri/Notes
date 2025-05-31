import icon from "../assets/icon.png";
import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import Sidebar from "../pages/Sidebar";

const notes = [
  { title: "hi", body: "hi i am shanu1 " },
  { title: "hi", body: "hi i am shanu2 " },
  { title: "hi", body: "hi i am shanu3 " },
  { title: "hi", body: "hi i am shanu3 " },
  { title: "hi", body: "hi i am shanu3 " },
  { title: "hi", body: "hi i am shanu3 " },
  { title: "hi", body: "hi i am shanu3 " },
  { title: "hi", body: "hi i am shanu3 " },
  { title: "hi", body: "hi i am shanu3 " },
];

function Dashboard() {
  const [open, setOpen] = useState(false);
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
      <div className="header">
        <button className="heading" onClick={toggleOpen}>
          Notes
        </button>
      </div>

      <div className="body">
        {notes.map((ele, i) => {
          return (
            <div className="note" key={i}>
              <p className="title">{ele.title}</p>
              <p className="text">{ele.body}</p>
              <div></div>
            </div>
          );
        })}
      </div>

      <button className="add">+</button>

      <Sidebar open={open} setOpen={setOpen}></Sidebar>
    </>
  );
}

export default Dashboard;
