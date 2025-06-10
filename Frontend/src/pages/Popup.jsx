import { useEffect } from "react";
import "../styles/popup.css"

const Popup = ({ msg, isSuccess, setPopupShow }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPopupShow(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`popup ${isSuccess ? "success" : "failure"}`}>{msg}</div>
  );
};

export default Popup;
