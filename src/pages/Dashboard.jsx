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

  return (
    <>

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

      <Sidebar></Sidebar>
    </>
  )
}

export default Dashboard;
