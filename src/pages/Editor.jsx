import { useEffect, useState } from "react";
import "../styles/Editor.css";

import Sidebar from "./Sidebar";

function Editor() {

  return (
    <>
      <Sidebar></Sidebar>
      <input className="title"></input>
      <textarea className="textarea"></textarea>
      <p className="status">status</p>
    </>
  );
}

export default Editor;
