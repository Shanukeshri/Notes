import "../styles/sidebar.css";
import icon from "../assets/icon.png";

function Sidebar({ open, setOpen }) {

  const toggleOpen = () => {
    setOpen(!open);
    console.log(open); //debug
  };
  return (
    <>
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

export default Sidebar;
