const Backend_url = import.meta.env.VITE_BACKEND_URL;

const fetchHandler = async (
  nav,
  setNotesArray,
  setLoaded,
  popupProp,
  setPopupProp,
  setPopupShow
) => {
  try {
    const fetchRes = await fetch(Backend_url + "/note", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "x-refresh-token": localStorage.getItem("refreshToken"),
      },
      method: "GET",
      credentials: "include",
    });

    const res = await fetchRes.json();

    if (fetchRes.ok && res.msg === "refreshed" && res.accessToken) {
      localStorage.setItem("accessToken", res.accessToken);
      return fetchHandler();
    }
    if (res.msg === "Please login again") {
      nav("/login");
    }

    if (fetchRes.ok) {
      setNotesArray(res.noteArray);
      setLoaded(true);
    }
    if(!fetchRes.ok && res.msg === "No notes found"){
      setLoaded(true)
    }


    if (!fetchRes.ok) {
      if (res.msg === "Tokens absent" || res.msg ==="Unauthorised") {
        console.log(res.status)
        setTimeout(() => {
          nav("/login");
        }, 0);
      }
    }

    setPopupProp({
      ...popupProp,
      msg: res.msg || "Loaded",
      isSuccess: fetchRes.ok,
    });
    setPopupShow(true);
  } catch (e) {
    console.log("error : -- ", e);
    setPopupProp({
      ...popupProp,
      msg: "Some Error Occured",
      isSuccess: false,
    });
    setPopupShow(true);
    nav("/login");
  }
};

export default fetchHandler;
