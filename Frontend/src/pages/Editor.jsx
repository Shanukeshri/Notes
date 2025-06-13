import { useEffect, useState, useRef } from "react";
import "../styles/Editor.css";
const Backend_url = import.meta.env.VITE_BACKEND_URL;
import Sidebar from "./Sidebar";
import { useLocation, useNavigate } from "react-router-dom";

function Editor() {
  const nav = useNavigate();
  const location = useLocation();
  const { state } = location;
  localStorage.setItem("current_id", state._id);
  const _id = localStorage.getItem("current_id");

  const [bodyText, setBodyText] = useState("");
  const [titleText, setTitleText] = useState("");
  const id = useRef();
  const id2 = useRef();
  const paraRef = useRef(null);

  const editorFetchHandler = async () => {
    try {
      const fetchRes = await fetch(Backend_url + "/note" + `?_id=${_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "x-refresh-token": localStorage.getItem("refreshToken"),
        },
        method: "GET",
        credentials: "include",
      });
      const res = await fetchRes.json();

      console.log("res : ", res);
      console.log("res.note : ", res.note);

      if (fetchRes.ok && res.msg === "refreshed" && res.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
        return editorFetchHandler();
      }
      if (res.msg === "Please login again") {
        nav("/login");
      }

      if (res.note.title) {
        setTitleText(res.note.title);
        setBodyText(res.note.body);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveHandler = async () => {};

  const bodyHandler = async (e) => {
    setBodyText(e.target.value);
    if (id.current) {
      clearTimeout(id.current);
    }
    id.current = setTimeout(async () => {
      paraRef.current.textContent = "saving...";

      const fetchRes = await fetch(Backend_url + "/note", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "x-refresh-token": localStorage.getItem("refreshToken"),
        },
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          _id: _id,
          title: titleText,
          body: e.target.value,
        }),
      });

      const res = await fetchRes.json();

      if (fetchRes.ok && res.msg === "refreshed" && res.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
        return editorFetchHandler();
      }
      if (res.msg === "Please login again") {
        nav("/login");
      }

      setTimeout(() => {
        paraRef.current.textContent = "";
      }, 700);
    }, 500);
  };

  const titleHandler = async (e) => {
    setTitleText(e.target.value);
    if (id2.current) {
      clearTimeout(id2.current);
    }
    id2.current = setTimeout(async () => {
      paraRef.current.textContent = "saving...";

      const fetchRes = await fetch(Backend_url + "/note", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "x-refresh-token": localStorage.getItem("refreshToken"),
        },
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          _id: _id,
          title: e.target.value,
          body: bodyText,
        }),
      });

      const res = await fetchRes.json();

      if (fetchRes.ok && res.msg === "refreshed" && res.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
        return editorFetchHandler();
      }
      if (res.msg === "Please login again") {
        nav("/login");
      }

      setTimeout(() => {
        paraRef.current.textContent = "";
      }, 700);
    }, 500);
  };

  useEffect(() => {
    editorFetchHandler();
    return () => {
      if (id.current) clearTimeout(id.current);
      if (id2.current) clearTimeout(id2.current);
    };
  }, []);

  return (
    <>
      <Sidebar></Sidebar>
      <input
        className="title"
        value={titleText}
        onChange={titleHandler}
        placeholder="Title..."
      ></input>
      <textarea
        className="textarea"
        value={bodyText}
        onChange={bodyHandler}
      ></textarea>
      <p className="status" ref={paraRef}></p>
    </>
  );
}

export default Editor;
