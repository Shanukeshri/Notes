const Backend_url = import.meta.env.VITE_BACKEND_URL;

const addHandler = async (nav) => {
  const fetchRes = await fetch(Backend_url + "/note", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "x-refresh-token": localStorage.getItem("refreshToken"),
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      title: `untitled`,
      body: "",
    }),
  });

  const res = await fetchRes.json();

  if (fetchRes.ok && res.msg === "refreshed" && res.accessToken) {
    localStorage.setItem("accessToken", res.accessToken);
    return addHandler();
  }
  if(res.msg === "Please login again"){
    nav("/login")
  }


  setTimeout(() => {
    nav("/editor", { state: { _id: res._id } });
  }, 500);
};

export default addHandler;
