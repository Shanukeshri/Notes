import "../styles/sidebar.css";
import icon from "../assets/icon.png";
import { useState, useEffect } from "react";

function Sidebar() {
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

      {open && <div className="back-dark" onClick={toggleOpen}></div>}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="imgheader">
          <div className="icon">
            <img className="iconimg" src={icon} />
          </div>
        </div>
        <button className="sidebar-button">Logout</button>
      </div>
    </>
  );
}

export default Sidebar;
