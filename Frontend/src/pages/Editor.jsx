  import { useEffect, useState, useRef } from "react";
import "../styles/Editor.css";

import Sidebar from "./Sidebar";

function Editor() {
  const [text, setText] = useState("");
  const id = useRef();
  const paraRef = useRef(null);

  const handler = (e) => {
    setText(e.target.value);
    if (id.current) {
      clearTimeout(id.current);
    }
    id.current = setTimeout(() => {
      console.log("stopped");
      paraRef.current.textContent = "saving...";
      setTimeout(() => {
        paraRef.current.textContent = "";
      }, 700);
    }, 500);
  };

  return (
    <>
      <Sidebar></Sidebar>
      <input className="title"></input>
      <textarea className="textarea" value={text} onChange={handler}></textarea>
      <p className="status" ref={paraRef}></p>
    </>
  );
}

export default Editor;
