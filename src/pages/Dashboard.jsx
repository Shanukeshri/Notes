import icon from "../assets/icon.png";
import "../styles/dashboard.css";
import { useState } from "react";

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


  };

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

      {/* yaha se sidebar */}
      {open && <div className="back-dark" onClick={toggleOpen}></div>}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="icon">
          <img className="iconimg" src={icon} />
        </div>
        <button className="sidebar-button">Logout</button>
      </div>
    </>
  );
}

export default Dashboard;
